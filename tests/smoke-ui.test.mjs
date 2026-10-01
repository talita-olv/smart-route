import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

test('o painel inicializa, preenche o SVG e gera a rota sem CDNs',async()=>{
 class El{
  constructor(){this.children=[];this.options=[];this.listeners={};this.value='';this.disabled=false;this.hidden=false;this.style={};this.classList={add(){},remove(){}};}
  replaceChildren(...children){this.children=children;this.options=children.filter(x=>x instanceof Opt);}
  add(option){this.options.push(option);}
  append(...children){this.children.push(...children);}
  setAttribute(key,val){this[key]=val;}
  addEventListener(event,callback){this.listeners[event]=callback;}
  scrollIntoView(){}
 }
 class Opt extends El{constructor(text,value){super();this.text=text;this.value=value;}}
 const elements=new Map();
 globalThis.Option=Opt;
 globalThis.document={
  getElementById(id){if(!elements.has(id))elements.set(id,new El());return elements.get(id);},
  createElement(){return new El();},
  createElementNS(){return new El();},
  createTextNode(text){const n=new El();n.textContent=text;return n;}
 };
 globalThis.window={};
 const byId=id=>document.getElementById(id);
 for(const [id,value] of Object.entries({capacity:'8','start-lat':'-22.9068','start-lng':'-43.1729',date:'2026-10-01'}))byId(id).value=value;
 await import('../assets/app.mjs?smoke=5');
 assert.equal(byId('kpi-all').textContent,48);
 assert.equal(byId('priority-mix').children.length,4);
 assert.equal(byId('status-mix').children.length,4);
 assert.equal(byId('geo-svg').children.filter(x=>x.cx!==undefined).length,48);
 assert.equal(byId('btn-export').disabled,true);
 byId('btn-route').listeners.click();
 assert.equal(byId('btn-export').disabled,false);
 assert.ok(byId('results-body').children.length>=3);
 assert.equal(byId('geo-svg').children.filter(x=>x.cx!==undefined).length,40);
 assert.ok(!byId('street-map').children.length); // Nenhuma biblioteca externa foi requisitada
 const csv=readFileSync(fileURLToPath(new URL('../exemplos/Modelo_SmartRoute.csv',import.meta.url)),'utf8');
 const csvInput={name:'teste.csv',size:csv.length,text:async()=>csv};
 await byId('file-input').listeners.change({target:{files:[csvInput],value:'teste.csv'}});
 assert.equal(byId('kpi-all').textContent,48);
 assert.ok(byId('notice').textContent.includes('48 registros importados'));
 globalThis.window.XLSX={
   read:()=>({SheetNames:['Atendimentos'],Sheets:{Atendimentos:{}}}),
   utils:{sheet_to_json:()=>[{id:'XLSX-TESTE',latitude:-22.9,longitude:-43.2,regiao:'Sul',tipo_servico:'Inspeção'}]}
 };
 const excelInput={name:'teste.xlsx',size:1500,arrayBuffer:async()=>new ArrayBuffer(5)};
 await byId('file-input').listeners.change({target:{files:[excelInput],value:'teste.xlsx'}});
 assert.equal(byId('kpi-all').textContent,1);
 assert.ok(byId('notice').textContent.includes('1 registros importados'));
});
