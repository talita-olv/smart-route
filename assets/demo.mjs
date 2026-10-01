/** 48 atendimentos inteiramente fictícios, criados apenas para demonstração pública. */
const LOCALIDADES = [
 ['Centro',-22.9068,-43.1729,'Centro/Norte'],['Tijuca',-22.9249,-43.2324,'Centro/Norte'],
 ['Maracanã',-22.9111,-43.2303,'Centro/Norte'],['Vila Isabel',-22.9166,-43.2440,'Centro/Norte'],
 ['Botafogo',-22.9519,-43.1840,'Sul'],['Flamengo',-22.9365,-43.1770,'Sul'],
 ['Copacabana',-22.9707,-43.1829,'Sul'],['Ipanema',-22.9834,-43.2044,'Sul'],
 ['Barra da Tijuca',-23.0010,-43.3650,'Oeste'],['Jacarepaguá',-22.9460,-43.3400,'Oeste'],
 ['Méier',-22.9000,-43.2850,'Oeste'],['Madureira',-22.8720,-43.3410,'Oeste']
];
const SERVICOS=['Atendimento técnico','Inspeção periódica','Instalação programada','Visita de campo'];
const PRIORIDADES=['Crítica','Alta','Média','Baixa','Alta','Média','Média','Baixa'];
export const DEMO=LOCALIDADES.flatMap(([bairro,latitude,longitude,regiao],locationIndex)=>
 Array.from({length:4},(_,j)=>{
 const i=locationIndex*4+j;
 return {
 id:'ATD-'+String(i+1).padStart(3,'0'),cliente:'Cliente fictício '+String(i+1).padStart(2,'0'),
 descricao:SERVICOS[j],segmento:['Assistência técnica','Inspeção','Instalação','Serviços externos'][j],
 tipo_servico:SERVICOS[j],grupo_local:'LOCAL-'+String(locationIndex+1).padStart(2,'0'),
 endereco_referencia:'Ponto ilustrativo no bairro '+bairro,bairro,cidade:'Rio de Janeiro',regiao,
 // Pequenos deslocamentos fixos tornam os pontos visíveis no mapa; não são endereços reais.
 lat:latitude+[-0.0019,-0.0006,0.0011,0.0020][j],
 lng:longitude+[-0.0022,0.0012,-0.0010,0.0024][j],
 prioridade:PRIORIDADES[(i+locationIndex)%PRIORIDADES.length],
 status:i%13===0?'Cancelado':i%11===0?'Concluído':i%5===0?'Programado':'Pendente',
 duracao_min:[30,45,65,50][j],janela_inicio:'08:00',janela_fim:'17:00',
 data_solicitacao:'2026-09-'+String(20+(i%10)).padStart(2,'0'),
 data_limite:'2026-10-'+String(2+(i%15)).padStart(2,'0'),
 equipe:['Equipe A','Equipe B','Equipe C'][Math.floor(locationIndex/4)],
 observacao:'Exemplo sem dados pessoais',canal_origem:['Portal','Central','Planejamento'][i%3]
 };}));
