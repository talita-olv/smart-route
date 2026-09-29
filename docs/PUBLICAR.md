# Publicação e gestão de deploy — SmartRoute

**O site é publicado automaticamente pelo GitHub Pages a partir da `main` / `(root)`, após o merge de um Pull Request. Não use push direto na `main` como forma de publicar.** Leia [../AGENTS.md](../AGENTS.md) e [../CONTRIBUTING.md](../CONTRIBUTING.md).

## Fluxo obrigatório

1. Abra ou localize a Issue da tarefa (Correção, Melhoria, Nova função ou Processo/Documentação).
2. Crie uma branch com o número da Issue a partir da `main` atualizada (ex.: `fix/42-importacao`).
3. Implemente e execute `node --test tests/*.test.mjs` e `node scripts/build_standalone.mjs`; quando aplicável, faça validação visual e atualize a documentação.
4. Abra PR para a `main` com `Closes #42` (entrega integral) ou `Refs #42` (parcial) na **descrição**. A verificação do PR valida a existência da Issue.
5. Aguarde os checks, revise o diff, resolva comentários e só então faça merge.
6. Acompanhe a execução de **pages build and deployment** e confirme a demonstração online em https://talita-olv.github.io/smart-route/ após o merge. Não declare sucesso antes da verificação.
7. Confirme o encerramento/atualização da Issue. Não deixe pendências ocultas.

## Proteção da branch `main` (configuração manual pela proprietária)

Em [Settings → Rules → Rulesets](https://github.com/talita-olv/smart-route/settings/rules) (ou em Branch protection rules), crie uma regra ativa direcionada a `main`, com:
- exigir Pull Request antes do merge;
- exigir status check de CI: job `quality` do workflow **Verify SmartRoute**; aguarde o nome aparecer na lista após a primeira execução de PR;
- bloquear force push e deleção, e exigir resolução de conversas quando disponível;
- ajustar a quantidade de aprovações à disponibilidade de revisores (para manutenção individual, não configure aprovação impossível de cumprir).

**Registrar uma política em Markdown não configura proteção de branch:** esta ação precisa ser ativada no GitHub pela proprietária. Até lá, todos devem seguir o fluxo por compromisso operacional.

## Configuração do GitHub Pages

Em [Settings → Pages](https://github.com/talita-olv/smart-route/settings/pages): **Deploy from a branch**, branch **main**, pasta **/(root)**. O `index.html` fica na raiz, sem etapa de build exigida pelo Pages. A verificação automática do código e do HTML independente é separada do deploy.

## Checklist pós-publicação

- Run de Pages concluído com sucesso.
- Site público carregando; indicadores, filtros e base de exemplo funcionam.
- Importação/roteirização/exportação e dispositivos afetados pela Issue conferidos.
- Issue vinculada atualizada e `CHANGELOG.md` revisado quando necessário.
