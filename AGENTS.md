# AGENTS.md — Regras de trabalho do SmartRoute

**Aplicação:** repositório inteiro, inclusive código, documentação, planilhas, exemplos, automações e trabalhos executados por qualquer agente de IA (independentemente do modelo ou ferramenta).

**Leia este arquivo antes de trabalhar.** Consulte também [CONTRIBUTING.md](CONTRIBUTING.md) e [docs/PUBLICAR.md](docs/PUBLICAR.md). Em caso de conflito, respeite instruções superiores e a configuração efetiva do GitHub; registre dúvidas na Issue, em vez de presumir autorização.

## Regra inegociável: Issue → branch → PR → testes/revisão → merge → deploy

1. **Antes de alterar qualquer arquivo**, examine Issues existentes para evitar duplicatas. Crie uma Issue específica para toda demanda nova: **[Correção]**, **[Melhoria]** ou **[Nova função]**. Tarefas de documentação, testes, manutenção do processo e infraestrutura também precisam de Issue (use **[Processo]** ou **[Documentação]**). Não abra uma Issue por pequeno subtópico se ele já faz parte do mesmo escopo claramente descrito; abra outra para entregas independentes.
2. A Issue deve indicar problema/oportunidade, contexto, resultado esperado, critérios de aceite, limitações e testes. Evite dados sensíveis. Atualize seu escopo antes de expandir uma implementação.
3. Crie **uma branch a partir da `main` atualizada**, identificando a Issue: `fix/123-descricao`, `improve/123-descricao`, `feat/123-descricao` ou `docs/123-descricao`. Nunca implemente diretamente na `main`; não use force push na `main`.
4. Faça mudanças focadas. Preserve exemplos fictícios, integridade dos dados, acessibilidade, versão móvel e critérios de roteirização. Acrescente/ajuste testes e documentação quando o comportamento mudar.
5. Execute `node --test tests/*.test.mjs` e `node scripts/build_standalone.mjs` antes do PR. Para mudanças de interface, confira o navegador móvel e desktop; não confunda build bem-sucedido com validação visual. Documente resultados ou limitações reais.
6. Abra um **Pull Request direcionado à `main`** com o template do repositório. **A descrição do PR DEVE referenciar o número real da Issue do próprio SmartRoute**, por exemplo `Closes #123` (quando o merge a concluir) ou `Refs #123` (quando não a concluir). Um número fictício, PR relacionado ou referência apenas no commit não basta. Mantenha Issue e PR vinculados.
7. Aguarde os checks do GitHub, analise o diff e resolva comentários/falhas **na mesma branch e no mesmo PR**. Não faça merge de PR com testes ou validação de vínculo de Issue reprovados.
8. **O deploy de produção ocorre exclusivamente depois do merge aprovado na `main`**; o GitHub Pages publica `main` a partir de `/(root)`. Depois, confirme o status de implantação e teste a URL pública e os fluxos afetados. Só então reporte como publicado.
9. Registre mudanças visíveis em `CHANGELOG.md`, quando aplicável. Confirme que a Issue foi encerrada pelo PR ou atualize-a com o que ainda faltar. Para correções posteriores ou escopo adicional, abra outra Issue/PR.

## Regras por tipo
- **Correção (bug):** descrever reprodução, esperado/observado, impacto e teste de regressão.
- **Melhoria:** explicar comportamento atual, mudança proposta e como medir/validar.
- **Nova função:** apresentar caso de uso, requisitos, alternativas/restrições e critérios de aceite.
- **Urgência/hotfix:** também começa com Issue e PR; priorize revisão rápida, não contorne `main`.

## Regras de segurança e divulgação
- Não incluir dados reais de empresas ou clientes, TAGs, credenciais, tokens, chaves, bases privadas, scripts proprietários, capturas sensíveis ou URLs internas nos commits, Issues ou PRs.
- Scripts de extração para sistemas de terceiros exigem autorização expressa, análise técnica e cuidado com os dados. Não afirmar integração ou roteirização viária em tempo real nesta demonstração.
- Não adicionar dependências, APIs externas, licenças ou coleta de dados sem justificar na Issue, verificar suas condições e documentar impactos.
- Evite afirmar que testes, deploy ou revisão foram concluídos sem obter evidência da execução.

## Regra de aplicação para agentes
Se receber um pedido de alteração sem Issue, **primeiro crie/verifique a Issue e informe seu número**; em seguida trabalhe por branch e PR. Se a integração não permitir alguma etapa, registre objetivamente a limitação e forneça o passo humano exato. Nunca simule links, aprovações, testes, commits ou deploys.

**Leituras complementares:** [Guia de contribuição](CONTRIBUTING.md) · [Publicação](docs/PUBLICAR.md) · [Validação](docs/VALIDACAO.md).
