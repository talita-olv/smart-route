# Conferência antes da divulgação

1. Verificar index.html na raiz e assets/core.mjs, assets/demo.mjs, assets/app.mjs, assets/style.css.
2. Confirmar que o botão Carregar exemplo apresenta 14 registros fictícios.
3. Gerar rotas para as duas equipes e verificar ausência de duplicatas e exportação CSV.
4. Baixar o Modelo_SmartRoute.xlsx, importar a aba Atendimentos e conferir dados aceitos.
5. Repetir com CSV; testar IDs duplicados e latitude ou longitude ausente.
6. Conferir links relativos em GitHub Pages, nos navegadores desktop e móvel.
7. Conferir indisponibilidade de mapa/CDN: dados e cálculo devem continuar operáveis nos fluxos previstos.
8. Não compartilhar base empresarial, credenciais, scripts internos nem publicar métricas de resultado sem evidências.

Teste automatizado: `node --test tests/core.test.mjs`. O teste de navegador e a ativação do Pages são etapas separadas.
