# SmartRoute | Roteirização personalizável

**Da planilha à sugestão de roteiros.** Projeto demonstrativo independente de portfólio por **Talita Souza**. O SmartRoute organiza demandas de campo em sugestões de programação por equipe, localização e prioridade. Seu ponto de partida é um modelo genérico; extrações e regras comerciais podem ser desenvolvidas individualmente para cada negócio.

**[Experimentar exemplo na interface](index.html)** · **[Baixar modelo Excel](exemplos/Modelo_SmartRoute.xlsx)** · **[Baixar exemplo CSV](exemplos/Modelo_SmartRoute.csv)** · **[Como publicar](docs/PUBLICAR.md)**

**Status:** código disponibilizado neste repositório independente. Para visualizar como site, habilite GitHub Pages em Settings → Pages (main / root); confirme o endereço antes da divulgação.

## Padrão obrigatório de desenvolvimento e deploy

**Toda tarefa futura (Correção, Melhoria, Nova função ou Processo/Documentação) começa com uma [Issue](https://github.com/talita-olv/smart-route/issues), segue em branch própria e chega à `main` somente por [Pull Request](https://github.com/talita-olv/smart-route/pulls) com a Issue real citada na descrição (`Closes #N` ou `Refs #N`).** Testes, revisão e merge antecedem o deploy do GitHub Pages. Não fazer commits diretos na `main`.

**Obrigatório para qualquer agente de IA, independentemente do modelo:** leia [AGENTS.md](AGENTS.md) antes de trabalhar; consulte [CONTRIBUTING.md](CONTRIBUTING.md) para o passo a passo. O template de PR e o CI verificam o vínculo à Issue.

## Para quem serve

Assistência técnica, manutenção, instalações, inspeções, coletas, visitas comerciais ou qualquer operação que recebe uma relação de pontos/atendimentos e precisa organizá-la por equipe e dia. Os 14 atendimentos da demonstração são **inteiramente fictícios** e servem apenas para experimentar o fluxo.

## Experimentar

1. Abra o site por GitHub Pages ou execute um servidor HTTP estático no diretório do projeto: `npx serve .` (Node.js) ou outro servidor local de sua preferência. Os módulos JavaScript requerem HTTP; abrir o arquivo `index.html` por `file://` pode não funcionar.
2. Clique em **Recarregar exemplo** para explorar uma base fictícia ou baixe e edite o **Modelo_SmartRoute.xlsx** na aba **Atendimentos**.
3. Importe um CSV ou XLSX, selecione os filtros, a data, o limite por rota e as coordenadas de partida.
4. Clique em **Gerar programação** e revise todos os atendimentos e a ordem sugerida.
5. Exporte a programação em CSV, se estiver adequada.

A versão demonstrativa importa os arquivos no navegador, sem upload para um backend deste projeto. A interface não carrega fontes externas. O Leaflet e o mapa OpenStreetMap são requisitados quando a seção se aproxima da tela ou mediante clique; o leitor SheetJS só é solicitado na importação Excel. Esses recursos exigem internet, mas dados, filtros e geração de roteiros não dependem deles. Se o leitor XLSX externo falhar, use o CSV UTF-8. **Não carregue dados confidenciais na demonstração pública sem avaliar as políticas de sua organização e as requisições de terceiros.**

## Funcionalidades disponíveis

- Filtros por termo, segmento, equipe, prioridade e situação.
- Base fictícia embutida e importação de CSV/XLSX (máximo de 20 MB e 20.000 linhas na demo).
- Validação de IDs repetidos e coordenadas geográficas WGS84.
- Agrupamento de atendimentos da mesma `grupo_local` na mesma rota, quando a capacidade informada permite.
- Geração de sequência heurística por proximidade com ponderação de prioridade, por equipe.
- Distribuição da carga excedente em dias úteis subsequentes, sem considerar feriados.
- Destaque da rota no mapa e exportação revisável em CSV.
- Mapa sob demanda com estado de carregamento e opção de tentar novamente; leitor Excel carregado somente quando necessário.
- Identidade visual com tons minerais, tipografia de sistema, cantos discretos e apresentação operacional.

**Importante:** a distância apresentada é em linha reta entre coordenadas. Não representa percurso viário, previsão de tráfego, melhor tempo, SLA, navegação GPS ou otimização matematicamente exata. Janelas horárias, prazo e duração do serviço são campos de entrada informativos nesta demonstração; não são restrições aplicadas no cálculo. Regras operacionais e cálculo viário real podem integrar uma versão personalizada.

## Personalização por negócio

```text
ERP / CRM / Sistema de chamados / planilha / API autorizada
         ↓
Script de extração individualizado
         ↓
Validação, tratamento e padronização dos campos
         ↓
Modelo SmartRoute (CSV ou Excel)
         ↓
Sugestão de roteiros → revisão humana → programação
```

Cada cliente pode ter um layout de extração próprio, desenvolvido mediante análise das permissões, tecnologia, regras de negócio e proteção de dados aplicáveis. **Não há script de extração empresarial conectado nem autorização implícita para acessar sistemas terceiros nesta demonstração.** Leia [Integração personalizada](docs/INTEGRACAO_PERSONALIZADA.md).

## Estrutura, como no projeto Mapa de 52 Semanas

| Caminho | Conteúdo |
|---|---|
| `index.html` | Aplicação web demonstrativa e apresentação do projeto |
| `assets/style.css` | Identidade visual e layout responsivo |
| `assets/core.mjs` | Validação, agrupamento, cálculo estimado e exportação |
| `assets/app.mjs` | Interface, importação de arquivo, filtros e mapa |
| `assets/demo.mjs` | Atendimentos fictícios para teste imediato |
| `exemplos/Modelo_SmartRoute.xlsx` | Planilha base pronta para editar |
| `exemplos/Modelo_SmartRoute.csv` | Exemplo do contrato em texto |
| `docs/REGRAS.md` | Critérios e limites da demonstração |
| `docs/INTEGRACAO_PERSONALIZADA.md` | Campos e escopo de scripts por cliente |
| `docs/PUBLICAR.md` | Repositório novo e GitHub Pages |
| `docs/VALIDACAO.md` | Checklist de revisão para publicação |
| `tests/core.test.mjs` | Testes automatizados de regras centrais |
| `.nojekyll` | Publicação direta dos arquivos no Pages |

## HTML de demonstração em um arquivo

Execute `node scripts/build_standalone.mjs` para gerar `SmartRoute_Demonstracao.html`. Ele incorpora CSS e JavaScript próprio; os modelos Excel/CSV permanecem disponíveis na pasta `exemplos` quando a aplicação é publicada. A biblioteca Leaflet, os tiles OpenStreetMap, o leitor Excel continuam dependendo de internet, conforme a seção de privacidade; a roteirização e o CSV podem funcionar sem mapa e sem leitor XLSX. O arquivo gerado é uma conveniência de apresentação, não é necessário para o GitHub Pages.

## Testes

```bash
node --test tests/*.test.mjs
```

Os testes automatizados cobrem leitura CSV, duplicatas, coordenadas, grupos, status, limite diário, exportação, proteção básica contra fórmulas em CSV e verificação estática de sintaxe, elementos da interface e carregamento sob demanda. Uma demonstração visual no navegador e os fluxos de importação devem ser conferidos antes da divulgação; consulte [Validação](docs/VALIDACAO.md).

## Privacidade e titularidade

Todos os dados de exemplo são fictícios. Nenhuma base corporativa, credencial ou script interno foi incluído. O aplicativo não possui backend, coleta de métricas de uso, cookies próprios ou autenticação. Serviços externos de mapa e CDN recebem requisições normais do navegador.

**© 2026 Talita Souza. Direitos reservados.** Este repositório é uma demonstração para avaliação, não uma licença de reutilização comercial do código. Para adaptações e integrações personalizadas, entre em contato pela página do perfil no [GitHub](https://github.com/talita-olv). Veja [LICENSE.md](LICENSE.md) e [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).