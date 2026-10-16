import test from 'node:test';
import assert from 'node:assert/strict';
import {buildRoutes,normalizeDate,normalizeRecords,deadlineStatus,exportProgramCSV} from '../assets/core.mjs';
import {DEMO} from '../assets/demo.mjs';

const sample=(id,group,limit,priority='Média',lat=-22.91)=>({
 ...DEMO[1],id,grupo_local:group,data_limite:limit,prioridade:priority,
 status:'Pendente',equipe:'Equipe Teste',lat,lng:-43.21
});
const scheduled=(routes,id)=>routes.find(r=>r.stops.some(s=>s.id===id));

test('regressão: ATD-033 vence em 04/10 e não deve ceder lugar aos prazos de 09/10',()=>{
 const teamC=DEMO.filter(s=>s.equipe==='Equipe C');
 const {routes}=buildRoutes(teamC,{startDate:'2026-10-01',maxStops:8});
 const target=scheduled(routes,'ATD-033');
 assert.ok(target,'ATD-033 está programado');
 assert.ok(target.data<='2026-10-04',`ATD-033 foi programado em ${target.data}`);
 const later=scheduled(routes,'ATD-038');
 assert.ok(later,'ATD-038 está programado');
 assert.ok(target.data<=later.data,'vencimento 04/10 deve preceder vencimento 09/10');
});
test('prazo prevalece sobre proximidade e criticidade isolada',()=>{
 const early=sample('VENCE-PRIMEIRO','A','2026-10-02','Crítica',-23.2);
 const nearby=sample('PROXIMO','B','2026-10-09','Crítica',-22.91);
 const {routes}=buildRoutes([nearby,early],{startDate:'2026-10-01',maxStops:1});
 assert.equal(routes[0].stops[0].id,'VENCE-PRIMEIRO');
 assert.equal(routes[0].data,'2026-10-01');
 assert.equal(routes[1].stops[0].id,'PROXIMO');
});
test('não usa folga de capacidade para preterir grupo mais urgente',()=>{
 const data=[sample('U1','URG1','2026-10-02'),sample('U2','URG1','2026-10-02'),
   sample('V1','URG2','2026-10-03'),sample('V2','URG2','2026-10-03'),
   sample('W1','FUTURO','2026-10-10')];
 const {routes}=buildRoutes(data,{startDate:'2026-10-01',maxStops:3});
 assert.deepEqual(routes.map(r=>r.stops.map(s=>s.id)),[['U1','U2'],['V1','V2','W1']]);
 assert.deepEqual(routes.map(r=>r.data),['2026-10-01','2026-10-02']);
 assert.ok(routes[1].stops.findIndex(s=>s.id==='V1')<routes[1].stops.findIndex(s=>s.id==='W1'));// Prazo posterior não passa na frente do grupo urgente.
});
test('fim de semana não recebe programação; vencimento impossível gera alerta',()=>{
 const {routes,warnings}=buildRoutes([sample('SAB','G','2026-10-04')],{startDate:'2026-10-03',maxStops:1});
 assert.equal(routes[0].data,'2026-10-05');
 assert.equal(deadlineStatus('2026-10-04',routes[0].data),'Após o prazo');
 assert.ok(warnings.some(w=>w.includes('SAB')&&w.includes('após o prazo')));
});
test('valida datas ISO e BR, rejeita datas inexistentes e registra prazo ausente',()=>{
 assert.equal(normalizeDate('04/10/2026'),'2026-10-04');
 assert.equal(normalizeDate('2026-02-29'),'');
 assert.equal(normalizeDate('31/02/2026'),'');
 assert.equal(normalizeDate('29/02/2028'),'2028-02-29');
 const {records,warnings}=normalizeRecords([
  {id:'BR',latitude:-22.91,longitude:-43.21,data_limite:'04/10/2026'},
  {id:'ERR',latitude:-22.91,longitude:-43.21,data_limite:'31/02/2026'}
 ]);
 assert.equal(records[0].data_limite,'2026-10-04');
 assert.equal(records[1].data_limite,'');
 assert.ok(warnings.some(w=>w.includes('ERR')&&w.includes('prazo inválido')));
 const planned=buildRoutes([...records.map(r=>({...r,equipe:'EQ',status:'Pendente'}))],{maxStops:1,startDate:'2026-10-01'});
 assert.equal(planned.routes[0].stops[0].id,'BR');
 assert.ok(planned.warnings.some(w=>w.includes('sem prazo válido')));
});
test('divide grupos acima da capacidade priorizando vencimento dentro do grupo',()=>{
 const {routes}=buildRoutes([
  sample('LATER','UNI','2026-10-09'),sample('EARLIER','UNI','2026-10-02'),sample('MID','UNI','2026-10-05')
 ],{maxStops:2,startDate:'2026-10-01'});
 assert.deepEqual(routes[0].stops.map(s=>s.id),['EARLIER','MID']);
 assert.equal(routes[1].stops[0].id,'LATER');
});
test('exportação contém data e situação de prazo sem confundir com execução',()=>{
 const result=buildRoutes([sample('LATE','G','2026-10-02')],{startDate:'2026-10-05',maxStops:1});
 const csv=exportProgramCSV(result.routes);
 assert.match(csv,/situacao_prazo/);
 assert.match(csv,/Após o prazo/);
 assert.match(csv,/2026-10-05/);
 assert.equal(deadlineStatus('','2026-10-05'),'Sem prazo informado');
});
