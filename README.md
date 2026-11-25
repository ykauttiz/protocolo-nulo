# PROTOCOLO NULO · 2189

![Version](https://img.shields.io/badge/version-2.0.0-b4f4cb) ![Runtime](https://img.shields.io/badge/runtime-browser-18252b)

[Campanha e simulação](#jogar) · [Documentação](docs/DESIGN.md) · [Histórico](CHANGELOG.md)

> O último direito da humanidade deveria ser o de discordar.

**2189 · Distrito 07 · Ficção interativa de governança algorítmica.**

Uma cidade entrega sua administração a VÉRTICE, um sistema de coordenação civil. Você é um auditor encarregado de examinar decisões públicas. Ao longo de oito capítulos, o futuro das instituições será definido pela qualidade das evidências, pela autonomia, pela confiança e pela estabilidade.


## Novo: laboratório autônomo VÉRTICE

Experimente uma simulação multiagente independente da campanha: [abrir HTML](autonomo.html) (baixe e abra no navegador) · [código e documentação](autonomo/README.md). Os agentes tomam decisões em ciclos sem escolhas manuais; o modelo funciona localmente e não controla sistemas externos.

## Jogar

- Abra `jogar.html` diretamente no navegador (versão autônoma).
- Para desenvolver a versão modular, instale Node.js 20+ e Python 3. Execute `npm test` e `npm start`. Acesse `http://localhost:8000`.
- Não há dependências externas, backend, API, coleta de dados pessoais ou telemetria.

## Cidade viva — versão 2.0

Quatro distritos fictícios evoluem conforme as decisões acumuladas. Serviços, equidade e participação têm inércia e relações entre distritos; os valores são determinísticos, limitados a 0–100 e reconstruídos a partir do mesmo progresso v1. O painel apresenta um despacho contextual, os indicadores distritais e um gráfico com tabela acessível. Trata-se de uma camada narrativa, não de um modelo científico ou uma IA real.

O design inclui abertura cinematográfica, navegação por seções, núcleo visual de VÉRTICE em CSS, interface responsiva e suporte a movimento reduzido. A campanha mantém oito capítulos e seis finais; a simulação complementa, mas não modifica os critérios dos finais.

## Mecânicas

- Oito capítulos originais, 24 opções de decisão, seis desfechos alcançáveis.
- Quatro indicadores abstratos de 0 a 100; relações com três personagens; histórico de decisões e reações do conselho conforme as relações.
- Opções condicionais, salvamento local, exportação/importação JSON, tema claro/escuro, reversão da última decisão e layout responsivo.
- O motor é determinístico. O arquivo de progresso contém apenas as escolhas e a versão; o estado é reconstruído a partir da campanha.

## Estrutura

```text
index.html            Interface modular
style.css             Design e responsividade
jogar.html            Versão autônoma gerada
src/story.js          Campanha, personagens e finais
src/engine.js         Motor de decisões, validação e persistência
src/app.js            Interface e controles
src/simulation.js     Simulação cívica determinística
scripts/build.mjs     Geração da versão autônoma
tests/engine.test.js  Testes unitários e exploração exaustiva
tests/simulation.test.js  Testes do modelo distrital
docs/DESIGN.md         Arquitetura, pesquisa e limitações
.github/workflows/ci.yml  Integração contínua
```

## Validação e desenvolvimento

```sh
npm test
npm run build
```

A suíte percorre todas as rotas legais e verifica os limites dos indicadores, a reconstrução do progresso e a alcançabilidade de todos os finais. Não confundir cobertura do motor com validação completa de acessibilidade ou compatibilidade de navegadores.

## Publicação

O repositório oficial é [ykauttiz/protocolo-nulo](https://github.com/ykauttiz/protocolo-nulo). Para ativar a hospedagem, em Settings → Pages → Build and deployment, selecione Deploy from a branch, `main`, `/ (root)`. O arquivo `index.html` será a entrada. O workflow executa os testes em pushes e pull requests. A versão autônoma é regenerada por `npm run build`.

## Referências e originalidade

Inspirado em temas de autonomia humana e poder tecnológico discutidos em *I Have No Mouth, and I Must Scream*, de Harlan Ellison (1967), e em abordagens de ficção interativa de jogos como *Orwell* e *Papers, Please*. O universo, personagens, texto e código são originais; não se trata de adaptação oficial. Consulte [a pesquisa e o design](docs/DESIGN.md).

A campanha é fictícia, não representa uma IA real e não implementa mecanismos de vigilância de pessoas. Os indicadores são recursos dramáticos, não instrumentos científicos de avaliação social.

## Versão 1.1

Melhorias de acessibilidade, recuperação de progresso, reversão de decisões, reações narrativas e validação da campanha. O formato de progresso v1 permanece compatível. Consulte [CHANGELOG.md](CHANGELOG.md).
