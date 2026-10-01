import test from 'node:test';import assert from 'node:assert/strict';
import {parseCSV,normalizeRecords,haversine,buildRoutes,exportProgramCSV,toCSV} from '../assets/core.mjs';
import {DEMO} from '../assets/demo.mjs';
test('parser CSV aceita ponto e vírgula e aspas',()=>{const raw=parseCSV('id;cliente;latitude;longitude\n"1";"Nome; exemplo";-22,9;-43,2\n');assert.equal(raw[0].cliente,'Nome; exemplo');assert.equal(normalizeRecords(raw).records[0].lat,-22.9);});
test('rejeita ID duplicado e coordenadas ausentes',()=>{const {records,warnings}=normalizeRecords([{id:'A',latitude:'-22',longitude:'-43'},{id:'A',latitude:'-22',longitude:'-43'},{id:'B',latitude:'',longitude:'-43'}]);assert.equal(records.length,1);assert.equal(warnings.length,2);});
test('agrupa mesma unidade no mesmo dia e não duplica visitas',()=>{const {routes}=buildRoutes(DEMO,{maxStops:8,startDate:'2026-10-01'});const ids=routes.flatMap(r=>r.stops.map(s=>s.id));assert.equal(ids.length,DEMO.filter(s=>['Pendente','Programado'].includes(s.status)).length);assert.equal(new Set(ids).size,ids.length);assert.ok(routes.every(r=>r.stops.length<=8));for(const group of new Set(DEMO.filter(s=>['Pendente','Programado'].includes(s.status)).map(s=>s.grupo_local))){const locations=routes.filter(r=>r.stops.some(s=>s.grupo_local===group));assert.equal(locations.length,1,group);}assert.ok(routes.length>=2);});
test('exclui serviços concluídos e cancelados',()=>{const extra=[{...DEMO[0],id:'DONE',status:'Concluído'},{...DEMO[0],id:'CANCEL',status:'Cancelado'}];const {routes}=buildRoutes([...DEMO,...extra]);assert.equal(routes.flatMap(r=>r.stops).length,DEMO.filter(s=>['Pendente','Programado'].includes(s.status)).length);});
test('gera distância e CSV exportável',()=>{assert.equal(haversine({lat:-22,lng:-43},{lat:-22,lng:-43}),0);const out=exportProgramCSV(buildRoutes(DEMO).routes);assert.match(out,/sequencia/);assert.match(out,/ATD-002/);});
test('divide grupo acima da capacidade emitindo aviso',()=>{const group=Array.from({length:4},(_,i)=>({...DEMO.find(s=>s.status==='Pendente'),id:`X${i}`,grupo_local:'X',equipe:'Teste'}));const r=buildRoutes(group,{maxStops:2});assert.ok(r.warnings.length);assert.equal(r.routes.length,2);});

test('exportação CSV protege texto de fórmulas de planilha',()=>{const csv=toCSV([{nome:'=HYPERLINK("https://exemplo.invalid","clique")',longitude:-43.2}],['nome','longitude']);assert.match(csv,/"'=HYPERLINK/);assert.match(csv,/"-43.2"/);});

test('novos campos informativos da base são preservados na importação e exportação',()=>{
 const raw={id:'T-001',cliente:'Cliente fictício',latitude:'-22,91',longitude:'-43,21',tipo_servico:'Instalação',endereco_referencia:'Ponto ilustrativo',regiao:'Sul',data_solicitacao:'2026-09-28',observacao:'Sem dado pessoal',canal_origem:'Portal',status:'Pendente',equipe:'Equipe A'};
 const row=normalizeRecords([raw]).records[0];assert.equal(row.tipo_servico,'Instalação');assert.equal(row.regiao,'Sul');
 const csv=exportProgramCSV(buildRoutes([row]).routes);assert.match(csv,/tipo_servico/);assert.match(csv,/Ponto ilustrativo/);
});
test('demonstração contém 48 atendimentos em três equipes e dados fictícios',()=>{assert.equal(DEMO.length,48);assert.equal(new Set(DEMO.map(x=>x.id)).size,48);assert.equal(new Set(DEMO.map(x=>x.equipe)).size,3);assert.ok(DEMO.every(x=>x.endereco_referencia.includes('ilustrativo')));});
