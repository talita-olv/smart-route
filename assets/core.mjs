/** SmartRoute Demo: funções puras, sem ligação com sistemas corporativos. */
export const HEADERS = ['id','cliente','descricao','segmento','grupo_local','bairro','cidade','latitude','longitude','prioridade','status','duracao_min','janela_inicio','janela_fim','data_limite','equipe'];
const aliases = {
 id:['id','codigo','ordem','chamado'], cliente:['cliente','local','nome'], descricao:['descricao','atividade','servico'],
 segmento:['segmento','categoria'], grupo_local:['grupo_local','grupo','unidade','planta'], bairro:['bairro'], cidade:['cidade','municipio'],
 latitude:['latitude','lat'], longitude:['longitude','lng','lon'], prioridade:['prioridade','criticidade'],
 status:['status','situacao'], duracao_min:['duracao_min','duracao','tempo_min'],
 janela_inicio:['janela_inicio','inicio_janela'], janela_fim:['janela_fim','fim_janela'],
 data_limite:['data_limite','prazo','vencimento'], equipe:['equipe','responsavel']
};
export const slug=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim().replace(/[\s-]+/g,'_');
export function parseCSV(text){
 const source=String(text).replace(/^\uFEFF/,''); const head=source.split(/\r?\n/,1)[0]; const separator=(head.match(/;/g)||[]).length>(head.match(/,/g)||[]).length?';':',';
 const rows=[]; let row=[], cell='', quote=false;
 for(let i=0;i<source.length;i++){const c=source[i];if(quote){if(c==='"'&&source[i+1]==='"'){cell+='"';i++;}else if(c==='"')quote=false;else cell+=c;}
 else if(c==='"') quote=true; else if(c===separator){row.push(cell);cell='';}else if(c==='\n'){row.push(cell.replace(/\r$/,''));if(row.some(v=>v.trim())) rows.push(row);row=[];cell='';}else cell+=c;}
 if(quote) throw new Error('CSV inválido: aspas não fechadas.');
 row.push(cell.replace(/\r$/,''));if(row.some(v=>v.trim()))rows.push(row);
 if(!rows.length) return [];const keys=rows.shift().map(v=>v.trim());return rows.map(c=>Object.fromEntries(keys.map((k,i)=>[k,c[i]??''])));
}
const get=(r,key)=>{const mapped=Object.fromEntries(Object.entries(r).map(([k,v])=>[slug(k),v]));let result='';for(const a of aliases[key]){if(Object.hasOwn(mapped,slug(a))){result=mapped[slug(a)];break;}}return String(result??'').trim();};
const number=(v)=>String(v??'').trim()===''?NaN:Number(String(v).trim().replace(',','.'));
const priority=p=>{const v=slug(p);return ({critica:'Crítica',critico:'Crítica',urgente:'Crítica',alta:'Alta',alto:'Alta',media:'Média',medio:'Média',baixa:'Baixa',baixo:'Baixa'})[v]||'Média';};
const state=s=>{const v=slug(s);return ({pendente:'Pendente',aberta:'Pendente',aberto:'Pendente',programado:'Programado',programada:'Programado',concluido:'Concluído',concluida:'Concluído',executado:'Concluído',cancelado:'Cancelado',cancelada:'Cancelado'})[v]||'Pendente';};
export function normalizeRecords(raw){const records=[], warnings=[], ids=new Set(); for(let i=0;i<raw.length;i++){
 const line=i+2,id=get(raw[i],'id'),lat=number(get(raw[i],'latitude')),lng=number(get(raw[i],'longitude'));
 if(!id){warnings.push(`Linha ${line}: sem ID; ignorada.`);continue;}if(ids.has(id)){warnings.push(`Linha ${line}: ID duplicado ${id}; ignorado.`);continue;}
 if(!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180||(!lat&&!lng)){warnings.push(`Linha ${line} (${id}): coordenadas ausentes ou inválidas; ignorada.`);continue;}
 ids.add(id);records.push({id,cliente:get(raw[i],'cliente')||`Atendimento ${id}`,descricao:get(raw[i],'descricao'),segmento:get(raw[i],'segmento')||'Serviços',grupo_local:get(raw[i],'grupo_local')||id,
 bairro:get(raw[i],'bairro'),cidade:get(raw[i],'cidade'),lat,lng,prioridade:priority(get(raw[i],'prioridade')),status:state(get(raw[i],'status')),
 duracao_min:Math.max(0,number(get(raw[i],'duracao_min'))||0),janela_inicio:get(raw[i],'janela_inicio'),janela_fim:get(raw[i],'janela_fim'),data_limite:get(raw[i],'data_limite'),equipe:get(raw[i],'equipe')||'Equipe não definida'});}
 return {records,warnings};}
export const haversine=(a,b)=>{const R=6371,dLat=(b.lat-a.lat)*Math.PI/180,dLng=(b.lng-a.lng)*Math.PI/180;const s=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.min(1,Math.sqrt(s)));};
const priorityRank={Crítica:0,Alta:1,Média:2,Baixa:3};
const businessDate=(iso,offset)=>{let d=new Date(`${iso}T12:00:00`);if(Number.isNaN(d.getTime()))d=new Date();while([0,6].includes(d.getDay()))d.setDate(d.getDate()+1);for(let i=0;i<offset;i++){d.setDate(d.getDate()+1);while([0,6].includes(d.getDay()))d.setDate(d.getDate()+1);}return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
export function buildRoutes(records,{start={lat:-22.9068,lng:-43.1729},maxStops=8,startDate='2026-10-01'}={}){
 if(!Number.isFinite(start.lat)||!Number.isFinite(start.lng)||Math.abs(start.lat)>90||Math.abs(start.lng)>180)throw new Error('Coordenadas do ponto de partida inválidas.');
 const max=Math.max(1,Math.min(50,Math.floor(Number(maxStops)||8)));const groups=new Map();const warnings=[];const routeList=[];
 for(const r of records.filter(r=>['Pendente','Programado'].includes(r.status))){if(!groups.has(r.equipe)) groups.set(r.equipe,[]);groups.get(r.equipe).push(r);}
 for(const [team,stops] of groups){const bundlesMap=new Map();for(const s of stops){const k=s.grupo_local||s.id;if(!bundlesMap.has(k))bundlesMap.set(k,[]);bundlesMap.get(k).push(s);}
 let pending=[...bundlesMap].flatMap(([name,items])=>{if(items.length<=max)return [{name,items}];warnings.push(`Grupo ${name} da ${team} excede ${max} paradas; dividido em mais de uma rota.`);const chunks=[];for(let i=0;i<items.length;i+=max)chunks.push({name,items:items.slice(i,i+max)});return chunks;});
 let routeIndex=0;while(pending.length){let here={...start},routeStops=[],km=0;
 while(pending.length){const eligible=pending.filter(b=>b.items.length+routeStops.length<=max);if(!eligible.length)break;
 eligible.sort((a,b)=>{const pa=Math.min(...a.items.map(s=>priorityRank[s.prioridade]??2)),pb=Math.min(...b.items.map(s=>priorityRank[s.prioridade]??2));const sa=haversine(here,a.items[0])+pa*2,sb=haversine(here,b.items[0])+pb*2;return sa-sb||a.name.localeCompare(b.name);});
 const picked=eligible[0];pending.splice(pending.indexOf(picked),1);
 const remaining=[...picked.items];while(remaining.length){remaining.sort((a,b)=>haversine(here,a)-haversine(here,b));const s=remaining.shift();km+=haversine(here,s);routeStops.push(s);here={lat:s.lat,lng:s.lng};}
 }
 if(!routeStops.length)throw new Error('Não foi possível montar a rota.');
 routeList.push({id:`R${String(routeList.length+1).padStart(3,'0')}`,equipe:team,data:businessDate(startDate,routeIndex++),stops:routeStops,kmEstimadoReto:km,duracaoServicoMin:routeStops.reduce((sum,s)=>sum+s.duracao_min,0)});
 }}return {routes:routeList,warnings};}
const quote=v=>{let value=String(v??'');if(typeof v==='string'&&/^[\s]*[=+@-]/.test(value))value="'"+value;return `"${value.replaceAll('\"','\"\"')}"`;};
export function toCSV(rows,headers){return '\uFEFF'+[headers.map(quote).join(';'),...rows.map(r=>headers.map(h=>quote(r[h])).join(';'))].join('\r\n');}
export function exportProgramCSV(routes){return toCSV(routes.flatMap(r=>r.stops.map((s,i)=>({rota:r.id,data:r.data,equipe:r.equipe,sequencia:i+1,id:s.id,cliente:s.cliente,descricao:s.descricao,grupo_local:s.grupo_local,cidade:s.cidade,bairro:s.bairro,latitude:s.lat,longitude:s.lng,prioridade:s.prioridade,duracao_min:s.duracao_min}))),['rota','data','equipe','sequencia','id','cliente','descricao','grupo_local','cidade','bairro','latitude','longitude','prioridade','duracao_min']);}
