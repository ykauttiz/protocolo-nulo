# PROTOCOLO NULO

> O último direito da humanidade deveria ser o de discordar.

**2189 · Distrito 07 · Ficção interativa de governança algorítmica.**

Uma cidade entrega sua administração a VÉRTICE, um sistema de coordenação civil. Você é um auditor encarregado de examinar decisões públicas. Ao longo de oito capítulos, o futuro das instituições será definido pela qualidade das evidências, pela autonomia, pela confiança e pela estabilidade.

## Jogar

- Abra `jogar.html` diretamente no navegador (versão autônoma).
- Para desenvolver a versão modular, instale Node.js 20+ e Python 3. Execute `npm test` e `npm start`. Acesse `http://localhost:8000`.
- Não há dependências externas, backend, API, coleta de dados pessoais ou telemetria.

## Mecânicas

- Oito capítulos originais, 24 opções de decisão, seis desfechos alcançáveis.
- Quatro indicadores abstratos de 0 a 100; relações com três personagens; histórico de decisões.
- Opções condicionais, salvamento local, exportação/importação JSON, tema claro/escuro e layout responsivo.
- O motor é determinístico. O arquivo de progresso contém apenas as escolhas e a versão; o estado é reconstruído a partir da campanha.

## Estrutura

```text
index.html            Interface modular
style.css             Design e responsividade
jogar.html            Versão autônoma gerada
src/story.js          Campanha, personagens e finais
src/engine.js         Motor de decisões, validação e persistência
src/app.js            Interface e controles
scripts/build.mjs     Geração da versão autônoma
tests/engine.test.js  Testes unitários e exploração exaustiva
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

Crie um repositório separado e envie os arquivos. Em Settings → Pages → Build and deployment, selecione Deploy from a branch, `main`, `/ (root)`. O arquivo `index.html` será a entrada. O workflow executa os testes em pushes e pull requests. A versão autônoma é regenerada por `npm run build`.

## Referências e originalidade

Inspirado em temas de autonomia humana e poder tecnológico discutidos em *I Have No Mouth, and I Must Scream*, de Harlan Ellison (1967), e em abordagens de ficção interativa de jogos como *Orwell* e *Papers, Please*. O universo, personagens, texto e código são originais; não se trata de adaptação oficial. Consulte [a pesquisa e o design](docs/DESIGN.md).

A campanha é fictícia, não representa uma IA real e não implementa mecanismos de vigilância de pessoas. Os indicadores são recursos dramáticos, não instrumentos científicos de avaliação social.
