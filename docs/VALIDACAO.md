# Conferência antes da divulgação

1. Verificar index.html na raiz e assets/core.mjs, assets/demo.mjs, assets/app.mjs, assets/style.css.
2. Confirmar que o botão Carregar exemplo apresenta 14 registros fictícios.
3. Gerar rotas para as duas equipes e verificar ausência de duplicatas e exportação CSV.
4. Baixar o Modelo_SmartRoute.xlsx, importar a aba Atendimentos e conferir dados aceitos.
5. Repetir com CSV; testar IDs duplicados e latitude ou longitude ausente.
6. Conferir links relativos em GitHub Pages, nos navegadores desktop e móvel.
7. Conferir indisponibilidade de mapa/CDN: dados e cálculo devem continuar operáveis nos fluxos previstos.
8. Não compartilhar base empresarial, credenciais, scripts internos nem publicar métricas de resultado sem evidências.

Teste automatizado: `node --test tests/*.test.mjs`. O teste de navegador e a ativação do Pages são etapas separadas.
## Teste periódico do fluxo de governança

Quando houver alteração no processo de contribuição ou nas regras da `main`, valide o fluxo completo em uma tarefa documental de baixo risco:

1. abra uma Issue real e crie uma branch com o número da Issue;
2. altere apenas documentação de validação ou governança;
3. abra um PR para `main` com `Closes #N` ou `Refs #N` na descrição;
4. confirme o check obrigatório `quality` e a validação da Issue;
5. faça o merge somente após os checks;
6. confirme o encerramento da Issue e a conclusão do deploy do GitHub Pages.

Esse teste não deve contornar a Ruleset, usar commit direto na `main` nem introduzir dados operacionais. Registre o resultado na própria Issue/PR.

## Verificação V1.2 · Issue #5
- [ ] CSV e XLSX têm 22 cabeçalhos compatíveis e 48 exemplos fictícios.
- [ ] Filtros adicionais, horas e exportação enriquecida funcionam.
- [ ] Mapa de ruas inicia automaticamente; falha de CDN mostra aviso e permite nova tentativa, sem impedir CSV/roteirização.
- [ ] Sem rede, a geração de rotas e CSV permanecem disponíveis.
- [ ] Seleção destaca rota no mapa de ruas; não há alternância para SVG.
- [ ] Limites públicos estão explícitos e campos meramente informativos não são promovidos como restrições.

## Branding e autoria V1.3

- [ ] Logo técnica, autoria de Talita Souza no cabeçalho/início/rodapé, termos acessíveis.
- [ ] Desktop e móvel sem overflow; contraste e avisos de mapa legíveis.
- [ ] Restrições de uso explícitas e sem promessa de proteção absoluta.

## Regressão de prazo — Issue #15

- [ ] Com data inicial 01/10/2026 e 48 casos fictícios, conferir que ATD-033 (crítica, vence em 04/10/2026) seja programada antes de grupos de prazo posterior da mesma equipe, conforme capacidade.
- [ ] Testar preenchimento com grupos de tamanhos diferentes: não colocar visita de prazo posterior antes de grupo urgente só porque há 1 vaga livre.
- [ ] Data de partida após vencimento ou prazo em sábado/domingo: sinalizar "Após o prazo"; verifique o alerta no topo, parada e exportação `situacao_prazo`.
- [ ] Planilha com prazo DD/MM/AAAA deve converter; 31/02/2026 deve emitir aviso e ser tratado como sem prazo.
- [ ] Carga sem prazo continua programável (após registros com data), com aviso; revisar data inicial, capacidade e equipe antes de exportar.
- [ ] Validação visual desktop/390/320 px e teste de importação XLSX/CSV. Sem garantia de tempo viário, feriados ou SLAs.
