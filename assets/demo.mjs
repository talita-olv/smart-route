/** Dados inteiramente fictícios, com coordenadas aproximadas de bairros. */
export const DEMO = [
['ATD-001','Centro',-22.9068,-43.1729,'Alta','Equipe A','UNIDADE-CENTRO',45],
['ATD-002','Centro',-22.9088,-43.1772,'Média','Equipe A','UNIDADE-CENTRO',30],
['ATD-003','Tijuca',-22.9249,-43.2324,'Crítica','Equipe A','UNIDADE-TIJUCA',60],
['ATD-004','Tijuca',-22.9271,-43.2315,'Alta','Equipe A','UNIDADE-TIJUCA',25],
['ATD-005','Maracanã',-22.9111,-43.2303,'Baixa','Equipe A','UNIDADE-MARACANA',35],
['ATD-006','Vila Isabel',-22.9166,-43.2440,'Alta','Equipe A','UNIDADE-VILA-ISABEL',70],
['ATD-007','Grajaú',-22.9210,-43.2611,'Média','Equipe A','UNIDADE-GRAJAU',50],
['ATD-008','Centro',-22.9079,-43.1759,'Baixa','Equipe A','UNIDADE-CENTRO',30],
['ATD-009','Botafogo',-22.9519,-43.1840,'Crítica','Equipe B','UNIDADE-BOTAFOGO',25],
['ATD-010','Flamengo',-22.9365,-43.1770,'Média','Equipe B','UNIDADE-FLAMENGO',45],
['ATD-011','Copacabana',-22.9707,-43.1829,'Baixa','Equipe B','UNIDADE-COPA',30],
['ATD-012','Copacabana',-22.9693,-43.1896,'Alta','Equipe B','UNIDADE-COPA',50],
['ATD-013','Leblon',-22.9839,-43.2239,'Média','Equipe B','UNIDADE-LEBLON',80],
['ATD-014','Ipanema',-22.9834,-43.2044,'Alta','Equipe B','UNIDADE-IPANEMA',45]
].map(([id,bairro,lat,lng,prioridade,equipe,grupo_local,duracao_min],i)=>({id,cliente:`Cliente Demonstração ${String(i+1).padStart(2,'0')}`,descricao:['Atendimento técnico','Inspeção','Visita programada','Instalação'][i%4],segmento:['Assistência técnica','Inspeção','Visitas','Instalação'][i%4],grupo_local,bairro,cidade:'Rio de Janeiro',lat,lng,prioridade,status:'Pendente',duracao_min,janela_inicio:'08:00',janela_fim:'17:00',data_limite:'',equipe}));
