// QA da interface; Playwright é fornecido pelo ambiente de testes, não pelo app.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end();}
 try{const data=fs.readFileSync(file);res.setHeader('Content-Type',({'.html':'text/html','.mjs':'text/javascript','.css':'text/css','.md':'text/plain'})[path.extname(file)]||'application/octet-stream');res.end(data);}catch{res.writeHead(404);res.end();}
});
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const url='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true});
 try{
  fs.mkdirSync(path.join(root,'qa-artifacts'),{recursive:true});
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForFunction(()=>document.querySelector('#kpi-all').textContent==='48');
  assert.equal(await page.locator('#geo-svg').count(),0);
  async function checkTable(expected){
   assert.equal(await page.locator('#table-body tr').count(),expected);
   const layout=await page.locator('.mini-table-wrap').evaluate(el=>{
    const css=getComputedStyle(el),th=getComputedStyle(el.querySelector('th'));
    return {max:css.maxHeight,overflow:css.overflowY,sticky:th.position,full:el.scrollHeight<=el.clientHeight+1};
   });
   assert.equal(layout.max,'none');assert.equal(layout.overflow,'visible');assert.equal(layout.sticky,'static');assert.ok(layout.full);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow horizontal');
   return (await page.locator('.mini-table-wrap').boundingBox()).height;
  }
  const fullHeight=await checkTable(48);
  await page.locator('#search').fill('Tijuca');assert.ok(await checkTable(8)<fullHeight);
  await page.locator('#search').fill('sem-resultados-inexistente');await checkTable(0);
  await page.locator('#btn-demo').click();await checkTable(48);

  await page.waitForFunction(()=>document.querySelector('#map-status').textContent==='Ruas disponíveis',{},{timeout:60000});
  await page.screenshot({path:path.join(root,'qa-artifacts/desktop.png'),fullPage:true});
  await page.locator('#btn-route').click();assert.equal(await page.locator('.route-card').count(),6);
  await page.getByRole('button',{name:'Destacar no mapa',exact:true}).first().click();assert.equal(await page.locator('.route-selected').count(),1);
  const downloadPromise=page.waitForEvent('download');await page.locator('#btn-export').click();const download=await downloadPromise;
  assert.equal(download.suggestedFilename(),'smart_route_programacao.csv');
  const exported=fs.readFileSync(await download.path(),'utf8');assert.ok(exported.includes('ATD-002'));
  await page.locator('#search').fill('Tijuca');assert.equal(await page.locator('#kpi-filter').innerText(),'8');
  await page.locator('#btn-demo').click();assert.equal(await page.locator('#kpi-filter').innerText(),'48');
  for(const extension of ['csv','xlsx']){
   await page.locator('#btn-demo').click();
   await page.locator('#file-input').setInputFiles(path.join(root,'exemplos/Modelo_SmartRoute.'+extension));
   await page.waitForFunction(()=>document.querySelector('#notice').textContent.includes('48 registros importados'),{},{timeout:60000});
  }
  for(const width of [390,320]){
   await page.setViewportSize({width,height:844});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow em '+width+'px');
   await checkTable(48);
   await page.locator('#btn-route').click();assert.equal(await page.locator('.route-card').count(),6);
   await page.screenshot({path:path.join(root,'qa-artifacts/mobile-'+width+'.png'),fullPage:true});
  }
  const blocked=await browser.newPage();let block=true;
  await blocked.route(/cdn.jsdelivr.net|unpkg.com|tile.openstreetmap.org/,route=>block?route.abort():route.continue());
  await blocked.goto(url);await blocked.waitForFunction(()=>document.querySelector('#map-status').textContent==='Mapa indisponível');
  await blocked.locator('#btn-route').click();assert.equal(await blocked.locator('.route-card').count(),6);
  assert.ok(await blocked.locator('#map-message').isVisible());
  block=false;await blocked.locator('#btn-load-map').click();
  await blocked.waitForFunction(()=>document.querySelector('#map-status').textContent==='Ruas disponíveis',{},{timeout:60000});
  assert.equal(await blocked.locator('#map-message').isVisible(),false);
  assert.deepEqual(errors,[]);
  console.log('PASS: desktop, 390px, 320px, ruas, 6 rotas, seleção, filtro, CSV/XLSX, exportação e recuperação de CDN.');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
