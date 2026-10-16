# Regras e limites da demonstração

- O aplicativo processa CSV/XLSX no navegador. Dados fictícios são disponibilizados para experimentar.
- IDs duplicados e coordenadas inválidas são descartados com aviso. Latitude e longitude devem estar em graus decimais WGS84.
- Roteirização considera somente situações Pendente e Programado.
- Agrupa por equipe e, quando o limite permite, por grupo_local. Grupos maiores que a capacidade são divididos com aviso.
- O máximo configurável é de 1 a 12 atendimentos por rota. O excedente é colocado em dias úteis seguintes, sem considerar feriados.
- A demonstração pública permite importar até 120 linhas por vez. Os 48 registros fictícios incluem 22 campos. Somente o mapa de ruas é exibido e inicia automaticamente; em caso de falha, há nova tentativa sem bloquear o planejamento.
- Região, tipo, endereço-referência, solicitação, origem e observação são informativos e não adicionam restrições ao cálculo.
- A programação heurística classifica primeiro por menor data limite, depois pela maior criticidade e, em seguida, pela proximidade geográfica. A data limite pode ser ISO (AAAA-MM-DD) ou brasileira (DD/MM/AAAA) na importação.
- Dentro da mesma equipe, grupos de `grupo_local` são mantidos juntos quando cabem na capacidade; grupos maiores são divididos. Uma folga na rota não é preenchida com grupo de prazo posterior se um grupo de prazo anterior não cabe; esse grupo inicia a rota do próximo dia útil. Isso pode deixar vagas ociosas em troca da regra de prazo.
- Quando o prazo não é informado ou é inválido, o atendimento fica após os com datas válidas e é sinalizado como sem prazo. Datas inválidas importadas geram aviso; um vencimento em sábado/domingo deve ser atendido até essa data, mas a programação só usa dias úteis, então poderá exigir antecipação.
- A situação "Após o prazo" compara apenas a **data** da rota à data limite (inclusive quando o início já está vencido); não é comprovação de execução nem de SLA. Avisos, detalhes da rota e exportação CSV exibem os conflitos, sem esconder ordens não viáveis no período.
- A ordem é heurística, não é ótima garantida. As linhas no mapa e km calculados são distâncias em linha reta, não trajetos viários nem trânsito.
- Duração de serviço, janelas, horas dos turnos, deslocamento real, feriados e restrições operacionais não limitam automaticamente o roteiro nesta versão. Revisão humana obrigatória.
- Revise os resultados antes de qualquer programação real. Nenhum atendimento é enviado automaticamente para campo.
- Não há acesso integrado a ERP, CRM, SAP nem banco de dados; scripts de extração são desenvolvimentos específicos e dependem de autorização.
