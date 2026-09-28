# Regras e limites da demonstração

- O aplicativo processa CSV/XLSX no navegador. Dados fictícios são disponibilizados para experimentar.
- IDs duplicados e coordenadas inválidas são descartados com aviso. Latitude e longitude devem estar em graus decimais WGS84.
- Roteirização considera somente situações Pendente e Programado.
- Agrupa por equipe e, quando o limite permite, por grupo_local. Grupos maiores que a capacidade são divididos com aviso.
- O máximo configurável é de 1 a 50 atendimentos por rota. O excedente é colocado em dias úteis seguintes, sem considerar feriados.
- A ordem é heurística baseada em proximidade e prioridade, não é ótima garantida. As linhas no mapa e km calculados são distâncias em linha reta, não trajetos viários nem trânsito.
- Datas limite, duração do serviço e janelas de horário não restringem automaticamente o roteiro nesta versão.
- Revise os resultados antes de qualquer programação real. Nenhum atendimento é enviado automaticamente para campo.
- Não há acesso integrado a ERP, CRM, SAP nem banco de dados; scripts de extração são desenvolvimentos específicos e dependem de autorização.
