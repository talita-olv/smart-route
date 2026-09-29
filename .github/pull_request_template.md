## Issue vinculada (obrigatória)

Closes #N

> Substitua N pelo número real da Issue deste repositório. Use `Refs #N` se este PR for parcial e não deva encerrar a Issue.

## Objetivo e alterações
Descreva o problema e o que mudou. Indique limites do escopo e impactos em interface, dados, integrações e documentação.

## Tipo
- [ ] Correção
- [ ] Melhoria
- [ ] Nova função
- [ ] Processo/documentação

## Evidências e validação
- [ ] `node --test tests/*.test.mjs`
- [ ] `node scripts/build_standalone.mjs`
- [ ] Revisei os fluxos afetados no navegador (desktop/móvel), se aplicável
- [ ] Confirmei que não há dados reais, credenciais ou informações internas
- [ ] Atualizei testes, README/docs e CHANGELOG quando necessário

**Resultados verificáveis, prints fictícios ou limitações:** descreva aqui.

## Publicação e riscos
- **Deploy:** este PR não publica produção antes do merge na `main`.
- **Riscos/rollback:** descreva ou marque “não aplicável”.
- **Verificação pós-merge:** status de GitHub Pages e comportamento público.
