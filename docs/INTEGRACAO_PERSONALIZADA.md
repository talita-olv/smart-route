# Integração individual: contrato de entrada

A demonstração não possui conexão com ERP/CRM/SAP, banco de dados, APIs internas ou credenciais. O projeto comercial pode receber um **conector de extração específico** após definição de escopo, permissões e regras com o cliente.

## Contrato de arquivo

O script deve produzir UTF-8 CSV (`;` como separador) ou XLSX com a aba `Atendimentos`. Colunas:

| Campo | Regra |
|---|---|
| id | Obrigatório; único por atendimento. |
| cliente | Identificação fictícia ou autorizada do ponto de atendimento. |
| descricao, segmento | Texto de categorização. |
| grupo_local | ID do mesmo endereço/unidade para agrupar numa rota. |
| bairro, cidade | Localização descritiva. |
| latitude, longitude | Obrigatórios; decimais WGS84. Sem endereço não é possível roteirizar nesta versão. |
| prioridade | Crítica, Alta, Média, Baixa. |
| status | Pendente, Programado, Concluído, Cancelado. Somente os dois primeiros entram nas rotas. |
| duracao_min | Estimativa em minutos da prestação do serviço, sem deslocamento. |
| janela_inicio, janela_fim | Metadados informativos; ainda não impõem restrições ao algoritmo demonstrativo. |
| data_limite | Metadado informativo; ainda não impõe restrições ao algoritmo demonstrativo. |
| equipe | Agrupamento das rotas por equipe. |

## Pipeline proposto para projetos individuais

```text
ERP / CRM / Ordens / Planilha / API autorizada
   -> script de extração (conforme tecnologia e permissões do cliente)
   -> validação, deduplicação e padronização do contrato CSV/XLSX
   -> importação no SmartRoute (manual nesta demonstração)
   -> revisão humana e exportação de programação
```

Os exemplos de script desta pasta são modelos **locais e sem conexão**. Não há automação de login, desvio de proteção nem extração de dados reais. A contratação de integração deve prever gestão de credenciais fora do repositório, permissões mínimas, retenção, tratamento de dados pessoais, auditoria e regras de negócio.

## O que um projeto personalizado pode acrescentar

Mapeamento de campos, scripts VBA ou integrações por API aprovada, agendamento autorizado, cálculo de deslocamento por motor viário licenciado, tempo de serviço, janelas horárias, capacidade de equipes e registro de programado × realizado. Nada disso é apresentado como funcionalidade já pronta na versão demo.
