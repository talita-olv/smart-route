/** SmartRoute Demo: funções puras, sem ligação com sistemas corporativos. */
export const HEADERS = ['id','cliente','descricao','segmento','grupo_local','bairro','cidade','latitude','longitude','prioridade','status','duracao_min','janela_inicio','janela_fim','data_limite','equipe','tipo_servico','endereco_referencia','regiao','data_solicitacao','observacao','canal_origem'];
const aliases = {
 tipo_servico:['tipo_servico','natureza_servico','servico_tipo'], endereco_referencia:['endereco_referencia','referencia','endereco'],regiao:['regiao','zona'],data_solicitacao:['data_solicitacao','solicitado_em'],observacao:['observacao','notas'],canal_origem:['canal_origem','origem'],
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
// Datas locais de calendário (sem hora/fuso); aceita ISO ou DD/MM/AAAA da planilha.
export function normalizeDate(value){
 const s=String(value??'').trim();
 if(!s)return '';
 const iso=/^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
 const br=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s);
 if(!iso&&!br)return '';
 const y=Number(iso?iso[1]:br[3]),m=Number(iso?iso[2]:br[2]),d=Number(iso?iso[3]:br[1]);
 const date=new Date(Date.UTC(y,m-1,d));
 if(y<1900||y>9999||date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d)return '';
 return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}
export function deadlineStatus(dateLimit,scheduledDate){
 const due=normalizeDate(dateLimit);
 if(!due)return 'Sem prazo informado';
 return scheduledDate>due?'Após o prazo':'Dentro do prazo';
}
export function normalizeRecords(raw){const records=[], warnings=[], ids=new Set(); for(let i=0;i<raw.length;i++){
 const line=i+2,id=get(raw[i],'id'),lat=number(get(raw[i],'latitude')),lng=number(get(raw[i],'longitude'));
 if(!id){warnings.push(`Linha ${line}: sem ID; ignorada.`);continue;}if(ids.has(id)){warnings.push(`Linha ${line}: ID duplicado ${id}; ignorado.`);continue;}
 if(!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180||(!lat&&!lng)){warnings.push(`Linha ${line} (${id}): coordenadas ausentes ou inválidas; ignorada.`);continue;}
 const inputDeadline=get(raw[i],'data_limite'),validDeadline=normalizeDate(inputDeadline);if(inputDeadline&&!validDeadline)warnings.push(`Linha ${line} (${id}): prazo inválido; tratado como sem prazo.`);
 ids.add(id);records.push({id,cliente:get(raw[i],'cliente')||`Atendimento ${id}`,descricao:get(raw[i],'descricao'),segmento:get(raw[i],'segmento')||'Serviços',grupo_local:get(raw[i],'grupo_local')||id,
 bairro:get(raw[i],'bairro'),cidade:get(raw[i],'cidade'),lat,lng,prioridade:priority(get(raw[i],'prioridade')),status:state(get(raw[i],'status')),
 tipo_servico:get(raw[i],'tipo_servico')||get(raw[i],'descricao')||'Serviço externo',endereco_referencia:get(raw[i],'endereco_referencia'),regiao:get(raw[i],'regiao'),data_solicitacao:get(raw[i],'data_solicitacao'),observacao:get(raw[i],'observacao'),canal_origem:get(raw[i],'canal_origem'),duracao_min:Math.max(0,number(get(raw[i],'duracao_min'))||0),janela_inicio:get(raw[i],'janela_inicio'),janela_fim:get(raw[i],'janela_fim'),data_limite:validDeadline,equipe:get(raw[i],'equipe')||'Equipe não definida'});}
 return {records,warnings};}
export const haversine=(a,b)=>{const R=6371,dLat=(b.lat-a.lat)*Math.PI/180,dLng=(b.lng-a.lng)*Math.PI/180;const s=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2;return 2*R*Math.asin(Math.min(1,Math.sqrt(s)));};
const priorityRank={Crítica:0,Alta:1,Média:2,Baixa:3};
const businessDate=(iso,offset)=>{
 let d=new Date(`${iso}T12:00:00Z`);
 while([0,6].includes(d.getUTCDay()))d.setUTCDate(d.getUTCDate()+1);
 for(let i=0;i<offset;i++){d.setUTCDate(d.getUTCDate()+1);while([0,6].includes(d.getUTCDay()))d.setUTCDate(d.getUTCDate()+1);}
 return d.toISOString().slice(0,10);
};
// Prazo, criticidade e só depois proximidade. Grupos mistos respeitam o menor prazo.
function compareStops(a,b,here){
 const dateA=normalizeDate(a.data_limite)||'9999-12-31',dateB=normalizeDate(b.data_limite)||'9999-12-31';
 return dateA.localeCompare(dateB)||(priorityRank[a.prioridade]??2)-(priorityRank[b.prioridade]??2)||haversine(here,a)-haversine(here,b)||a.id.localeCompare(b.id);
}
function compareBundles(a,b,here){
 const due=bundle=>bundle.items.reduce((min,s)=>{const d=normalizeDate(s.data_limite)||'9999-12-31';return d<min?d:min;},'9999-12-31');
 const ra=Math.min(...a.items.map(s=>priorityRank[s.prioridade]??2));
 const rb=Math.min(...b.items.map(s=>priorityRank[s.prioridade]??2));
 return due(a).localeCompare(due(b))||ra-rb||haversine(here,a.items[0])-haversine(here,b.items[0])||a.name.localeCompare(b.name);
}
export function buildRoutes(records,{start={lat:-22.9068,lng:-43.1729},maxStops=8,startDate='2026-10-01'}={}){
 if(!Number.isFinite(start.lat)||!Number.isFinite(start.lng)||Math.abs(start.lat)>90||Math.abs(start.lng)>180)throw new Error('Coordenadas do ponto de partida inválidas.');
 const firstDay=normalizeDate(startDate);if(!firstDay)throw new Error('Data inicial inválida. Use uma data de calendário válida.');
 const max=Math.max(1,Math.min(50,Math.floor(Number(maxStops)||8)));const groups=new Map();const warnings=[];const routeList=[];
 const eligible=records.filter(r=>['Pendente','Programado'].includes(r.status));
 const noDeadline=eligible.filter(r=>!normalizeDate(r.data_limite));
 if(noDeadline.length)warnings.push(`${noDeadline.length} atendimento(s) sem prazo válido: classificado(s) após os que têm data limite. Verifique os dados.`);
 for(const r of eligible){if(!groups.has(r.equipe))groups.set(r.equipe,[]);groups.get(r.equipe).push(r);}
 for(const [team,stops] of groups){
  const bundlesMap=new Map();
  for(const s of stops){const k=s.grupo_local||s.id;if(!bundlesMap.has(k))bundlesMap.set(k,[]);bundlesMap.get(k).push(s);}
  let pending=[...bundlesMap].flatMap(([name,items])=>{
   const ordered=[...items].sort((a,b)=>compareStops(a,b,start));
   if(items.length<=max)return [{name,items:ordered}];
   warnings.push(`Grupo ${name} da ${team} excede ${max} paradas; dividido em mais de uma rota.`);
   const chunks=[];for(let i=0;i<ordered.length;i+=max)chunks.push({name,items:ordered.slice(i,i+max)});
   return chunks;
  });
  let routeIndex=0;
  while(pending.length){
   const date=businessDate(firstDay,routeIndex++);let here={...start},routeStops=[],km=0;
   while(pending.length){
    pending.sort((a,b)=>compareBundles(a,b,here));
    const picked=pending[0];
    // Nunca preencher folga com um prazo posterior, empurrando um grupo mais urgente ao dia seguinte.
    if(picked.items.length+routeStops.length>max)break;
    pending.shift();
    const remaining=[...picked.items];
    while(remaining.length){
     remaining.sort((a,b)=>compareStops(a,b,here));
     const s=remaining.shift();km+=haversine(here,s);routeStops.push(s);here={lat:s.lat,lng:s.lng};
    }
   }
   if(!routeStops.length)throw new Error('Não foi possível montar a rota.');
   routeList.push({id:`R${String(routeList.length+1).padStart(3,'0')}`,equipe:team,data:date,stops:routeStops,kmEstimadoReto:km,duracaoServicoMin:routeStops.reduce((sum,s)=>sum+s.duracao_min,0)});
  }
 }
 const late=routeList.flatMap(r=>r.stops.filter(s=>deadlineStatus(s.data_limite,r.data)==='Após o prazo').map(s=>s.id));
 if(late.length)warnings.push(`ATENÇÃO: ${late.length} atendimento(s) sugerido(s) após o prazo (${late.slice(0,8).join(', ')}${late.length>8?', ...':''}). Revise capacidade, equipes e data inicial.`);
 return {routes:routeList,warnings};
}
const quote=v=>{let value=String(v??'');if(typeof v==='string'&&/^[\s]*[=+@-]/.test(value))value="'"+value;return `"${value.replaceAll('\"','\"\"')}"`;};
export function toCSV(rows,headers){return '\uFEFF'+[headers.map(quote).join(';'),...rows.map(r=>headers.map(h=>quote(r[h])).join(';'))].join('\r\n');}
export function exportProgramCSV(routes){return toCSV(routes.flatMap(r=>r.stops.map((s,i)=>({rota:r.id,data:r.data,equipe:r.equipe,sequencia:i+1,id:s.id,cliente:s.cliente,descricao:s.descricao,tipo_servico:s.tipo_servico,segmento:s.segmento,grupo_local:s.grupo_local,endereco_referencia:s.endereco_referencia,bairro:s.bairro,cidade:s.cidade,regiao:s.regiao,latitude:s.lat,longitude:s.lng,prioridade:s.prioridade,status:s.status,duracao_min:s.duracao_min,janela_inicio:s.janela_inicio,janela_fim:s.janela_fim,data_solicitacao:s.data_solicitacao,data_limite:s.data_limite,canal_origem:s.canal_origem,observacao:s.observacao,situacao_prazo:deadlineStatus(s.data_limite,r.data)}))),['rota','data','equipe','sequencia',...HEADERS,'situacao_prazo']);}
