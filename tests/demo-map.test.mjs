import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {DEMO} from '../assets/demo.mjs';
import {parseCSV,buildRoutes,HEADERS,normalizeRecords} from '../assets/core.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
test('CSV e demo possuem 48 registros e o mesmo contrato de 22 colunas',()=>{
 const csv=readFileSync(root+'exemplos/Modelo_SmartRoute.csv','utf8');
 const names=csv.replace(/^\uFEFF/,'').split(/\r?\n/)[0].split(';').map(x=>x.replaceAll('"',''));
 assert.deepEqual(names,HEADERS);
 const rows=parseCSV(csv);assert.equal(rows.length,48);assert.equal(DEMO.length,48);
 const norm=normalizeRecords(rows);assert.equal(norm.records.length,48);assert.equal(norm.warnings.length,0);
 for(let i=0;i<48;i++){assert.equal(norm.records[i].id,DEMO[i].id);assert.ok(Math.abs(norm.records[i].lat-DEMO[i].lat)<.00006);}
 const routes=buildRoutes(norm.records,{maxStops:8,startDate:'2026-10-01'}).routes;
 const ids=routes.flatMap(r=>r.stops.map(s=>s.id));
 assert.equal(new Set(ids).size,ids.length);assert.ok(routes.every(r=>r.stops.length<=8));
});
test('mapa de ruas é a única visualização e inicia sem bloquear o painel',()=>{
 const app=readFileSync(root+'assets/app.mjs','utf8'),html=readFileSync(root+'index.html','utf8');
 assert.match(html,/id="street-map"/);assert.match(html,/id="map-message"/);
 assert.doesNotMatch(html,/geo-svg|btn-quick-map|visão rápida|ruas \(opcional\)/i);
 assert.doesNotMatch(app,/geoProject|renderQuickMap|backToQuick/);
 assert.match(app,/void startMap\(\);/);assert.match(app,/tiles.redraw\(\)/);
});
