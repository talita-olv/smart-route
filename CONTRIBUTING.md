# Contribuindo com o SmartRoute

Este fluxo é obrigatório para colaboradores humanos e assistentes/agentes de IA. **Comece por [AGENTS.md](AGENTS.md).** O objetivo é manter rastreabilidade e impedir alterações sem avaliação na página pública.

## 1. Registre a tarefa

Veja as [Issues](https://github.com/talita-olv/smart-route/issues) antes de criar outra. Use o formulário adequado:

| Tipo | Prefixo do título | Quando usar |
|---|---|---|
| Correção | `[Correção]` | Defeito, regressão, erro de importação, layout ou cálculo |
| Melhoria | `[Melhoria]` | Otimização visual, experiência, desempenho ou manutenção sem nova capacidade independente |
| Nova função | `[Nova função]` | Funcionalidade ou integração ainda inexistente |
| Processo/documentação | `[Processo]` ou `[Documentação]` | Governança, manuais, CI e melhorias de trabalho |

Cada Issue precisa de descrição, resultado esperado, critérios de aceite e plano de validação. Demandas independentes devem ter Issues diferentes; subtarefas do mesmo resultado podem ficar no checklist de uma Issue.

## 2. Abra uma branch por tarefa

Atualize a referência da `main` e crie um nome que inclua o número real da Issue:

```text
fix/42-corrigir-importacao
improve/43-mapa-mais-rapido
feat/44-exportacao-pdf
docs/45-fluxo-pr
```

Não commite diretamente na `main` e não publique recursos corporativos neste repositório de demonstração.

## 3. Implemente e valide

```bash
node --test tests/*.test.mjs
node scripts/build_standalone.mjs
```

Em alterações visuais, revise também no navegador e em telas pequenas. Confira importação CSV/XLSX, geração de roteiros, dados fictícios, mensagens de erro, performance e o impacto de bibliotecas externas de acordo com a mudança. Inclua teste de regressão para bugs e atualize `CHANGELOG.md` para alterações relevantes.

## 4. Abra um PR vinculado à Issue

Use o modelo `.github/pull_request_template.md`, com **`Closes #N` ou `Refs #N` na descrição**, sendo `N` uma Issue que exista neste repositório. O CI verifica essa ligação. Descreva alterações, evidências/testes e riscos. Um PR deve ter escopo revisável. Para trabalho parcial, use `Refs #N`; não encerre a Issue prematuramente.

## 5. Merge, publicação e acompanhamento

Espere os checks passarem e resolva comentários. A revisão acontece no PR. Somente depois faça merge na `main`, que alimenta o GitHub Pages. Verifique o run de publicação e o site [SmartRoute](https://talita-olv.github.io/smart-route/). Encerre ou atualize a Issue após confirmar o resultado, sem declarar deploy como concluído antes da evidência.

### Proteção recomendada da `main`

A proprietária deve configurar em **Settings → Rules → Rulesets** (ou Branch protection rules, se disponível) uma regra ativa para `main`: exigir Pull Request antes de merge, exigir check de CI `quality` (workflow **Verify SmartRoute**), impedir force-push e deleção, e exigir resolução de comentários quando possível. Em repositório mantido por uma pessoa só, o número mínimo de aprovações pode ser configurado conforme os revisores disponíveis; o PR e os checks continuam obrigatórios. **A documentação não ativa essa proteção automaticamente.**

Consulte [docs/PUBLICAR.md](docs/PUBLICAR.md).
