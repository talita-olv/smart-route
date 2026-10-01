import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

test('falha de mapa não bloqueia painel, rotas, importação CSV/XLSX e nova tentativa',async()=>{
 class El{
  constructor(){this.children=[];this.options=[];this.listeners={};this.value='';this.disabled=false;this.hidden=false;this.style={};this.classList={add(){},remove(){}};}
  replaceChildren(...children){this.children=children;this.options=children.filter(x=>x instanceof Opt);}
  add(option){this.options.push(option);}
  append(...children){this.children.push(...children);}
  setAttribute(key,val){this[key]=val;}
  addEventListener(event,callback){this.listeners[event]=callback;}
  scrollIntoView(){}
  remove(){}
 }
 class Opt extends El{constructor(text,value){super();this.text=text;this.value=value;}}
 const elements=new Map();
 globalThis.Option=Opt;
 globalThis.document={
  getElementById(id){if(!elements.has(id))elements.set(id,new El());return elements.get(id);},
  createElement(){return new El();},
  head:{append(el){queueMicrotask(()=>el.onerror());}},
  createTextNode(text){const n=new El();n.textContent=text;return n;}
 };
 globalThis.window={};
 const byId=id=>document.getElementById(id);
 for(const [id,value] of Object.entries({capacity:'8','start-lat':'-22.9068','start-lng':'-43.1729',date:'2026-10-01'}))byId(id).value=value;
 await import('../assets/app.mjs?smoke=5');
 assert.equal(byId('kpi-all').textContent,48);
 assert.equal(byId('priority-mix').children.length,4);
 assert.equal(byId('status-mix').children.length,4);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(byId('map-status').textContent,'Mapa indisponível');
 assert.match(byId('map-message').textContent,/continuam disponíveis/);
 assert.equal(byId('btn-load-map').disabled,false);
 assert.equal(byId('btn-export').disabled,true);
 byId('btn-route').listeners.click();
 assert.equal(byId('btn-export').disabled,false);
 assert.ok(byId('results-body').children.length>=3);
 byId('btn-load-map').listeners.click();
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(byId('map-status').textContent,'Mapa indisponível');
 assert.ok(!byId('street-map').children.length); // Falha do mapa não interrompeu geração das rotas
 const csv=readFileSync(fileURLToPath(new URL('../exemplos/Modelo_SmartRoute.csv',import.meta.url)),'utf8');
 const csvInput={name:'teste.csv',size:csv.length,text:async()=>csv};
 await byId('file-input').listeners.change({target:{files:[csvInput],value:'teste.csv'}});
 assert.equal(byId('kpi-all').textContent,48);
 assert.ok(byId('notice').textContent.includes('48 registros importados'));
 // Recuperação da CDN, marcadores e seleção em um mapa Leaflet simulado.
 let layers=[],tileEvents={},redraws=0;
 const group={addTo(){return this;},clearLayers(){layers=[];},getLayers(){return layers;},getBounds(){return {isValid:()=>true,pad(){return this;}};}};
 const map={setView(){return this;},fitBounds(){},invalidateSize(){}};
 const feature=()=>({bindPopup(){return this;},addTo(){layers.push(this);return this;}});
 globalThis.L=globalThis.window.L={map:()=>map,control:{zoom:()=>({addTo(){}})},featureGroup:()=>group,
  circleMarker:feature,polyline:feature,tileLayer:()=>({on(event,cb){tileEvents[event]=cb;return this;},addTo(){return this;},redraw(){redraws++;}})};
 globalThis.requestAnimationFrame=cb=>cb();
 byId('btn-load-map').listeners.click();await new Promise(resolve=>setImmediate(resolve));
 assert.equal(byId('map-message').hidden,true);assert.equal(layers.length,48);
 tileEvents.load();assert.equal(byId('map-status').textContent,'Ruas disponíveis');
 tileEvents.tileerror();assert.equal(byId('btn-load-map').hidden,false);
 byId('btn-load-map').listeners.click();await new Promise(resolve=>setImmediate(resolve));tileEvents.load();
 assert.equal(redraws,1);assert.equal(byId('map-status').textContent,'Ruas disponíveis');
 byId('btn-route').listeners.click();assert.ok(layers.length>40);
 globalThis.window.XLSX={
   read:()=>({SheetNames:['Atendimentos'],Sheets:{Atendimentos:{}}}),
   utils:{sheet_to_json:()=>[{id:'XLSX-TESTE',latitude:-22.9,longitude:-43.2,regiao:'Sul',tipo_servico:'Inspeção'}]}
 };
 const excelInput={name:'teste.xlsx',size:1500,arrayBuffer:async()=>new ArrayBuffer(5)};
 await byId('file-input').listeners.change({target:{files:[excelInput],value:'teste.xlsx'}});
 assert.equal(byId('kpi-all').textContent,1);
 assert.ok(byId('notice').textContent.includes('1 registros importados'));
});
