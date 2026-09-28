import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join,resolve} from 'node:path';

const root=resolve(fileURLToPath(new URL('../',import.meta.url)));
test('todos os módulos da interface têm sintaxe JavaScript válida',()=>{
  for(const path of ['assets/core.mjs','assets/demo.mjs','assets/app.mjs','scripts/build_standalone.mjs']){
    assert.doesNotThrow(()=>execFileSync(process.execPath,['--check',join(root,path)],{cwd:root,stdio:'pipe'}),path);
  }
});
test('elementos referenciados pelo painel existem no HTML',()=>{
  const app=readFileSync(join(root,'assets/app.mjs'),'utf8');
  const html=readFileSync(join(root,'index.html'),'utf8');
  const ids=[...app.matchAll(/byId\('([^']+)'\)/g)].map(m=>m[1]);
  for(const id of new Set(ids))assert.match(html,new RegExp('id="'+id+'"'),'Falta o elemento #'+id);
});


test('bibliotecas externas não bloqueiam carregamento inicial',()=>{const html=readFileSync(join(root,'index.html'),'utf8');const app=readFileSync(join(root,'assets/app.mjs'),'utf8');assert.doesNotMatch(html,/<script[^>]+src="https:\/\/(?:unpkg|cdn\.jsdelivr)/);assert.doesNotMatch(html,/fonts\.googleapis\.com/);assert.match(app,/IntersectionObserver/);assert.match(app,/function ensureXLSX/);assert.match(app,/function ensureLeaflet/);assert.match(html,/id="btn-load-map"/);});
