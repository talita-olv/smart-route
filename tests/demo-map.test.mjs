import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {geoProject} from '../assets/geo.mjs';
import {DEMO} from '../assets/demo.mjs';
import {parseCSV,buildRoutes,HEADERS,normalizeRecords} from '../assets/core.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
test('projeção SVG usa coordenadas sem rede e cabe nos limites',()=>{
 const p=geoProject(DEMO),points=DEMO.map(x=>p.point(x));
 assert.ok(points.every(v=>v.x>=0&&v.x<=900&&v.y>=0&&v.y<=445));
 assert.notDeepEqual(points[0],points.at(-1));
});
test('projeção mantém ponto visível quando todos compartilham coordenadas',()=>{
 const p=geoProject([{lat:-22.9,lng:-43.2},{lat:-22.9,lng:-43.2}]);
 assert.deepEqual(p.point({lat:-22.9,lng:-43.2}),{x:450,y:222.5});
});
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
test('HTML usa mapa SVG como padrão e ruas somente por ação',()=>{
 const app=readFileSync(root+'assets/app.mjs','utf8'),html=readFileSync(root+'index.html','utf8');
 assert.match(html,/id="geo-svg"/);assert.match(html,/id="street-map"/);
 assert.match(app,/renderQuickMap\(data\)/);assert.match(app,/function startMap\(/);
 assert.doesNotMatch(app,/IntersectionObserver/);assert.match(html,/Mapa de ruas \(opcional\)/);
});
