# VÉRTICE / PROTOCOLO NULO

> Uma sociedade sintética. Um núcleo autônomo. Um conflito entre estabilidade e pluralidade.

Simulação multiagente original inspirada nos temas de poder tecnológico e autonomia de *I Have No Mouth, and I Must Scream*. Não é adaptação do conto nem um jogo de escolhas. Os agentes e o coordenador evoluem sem intervenção a cada ciclo.

## Executar

Requisito: Node.js 20+. Nenhuma instalação de dependência.

```sh
npm start -- --bots 60 --ticks 1000 --seed 2189 --every 100
npm test
```

Para obter um estado estruturado, sem relatórios intermediários:

```sh
node src/cli.mjs --bots 36 --ticks 500 --json > estado.json
```

## Arquitetura

- `src/world.mjs`: motor puro de simulação, agentes independentes, memória limitada, decisão por utilidade, atualização de valores por reforço simples, coordenador e dinâmica ambiental.
- `src/cli.mjs`: execução autônoma em terminal, argumentos validados, relatórios e JSON.
- `tests/world.test.mjs`: reprodutibilidade, isolamento de estado, limites, memória, decisões, execução longa.
- `.github/workflows/ci.yml`: validação automatizada em Node 20, 22 e 24.

Em cada ciclo, todos os agentes observam o mesmo estado, decidem independentemente e agregam suas ações. O núcleo seleciona prioridades abstratas e aprende uma estimativa de retorno. Energia, conhecimento, coesão, estabilidade e pluralidade evoluem conforme as ações. A contradição narrativa aparece quando estabilidade ≥ 60 coincide com pluralidade < 45 (limiares convencionais da simulação). O resultado é reproduzível por semente, não uma narrativa predefinida. Compare `--scenario paradox` (prioridade fixa à eficiência) com `--scenario balance` (sem esse viés); são hipóteses matemáticas fictícias, não modelos de controle de pessoas.

O projeto é uma simulação computacional fictícia, não AGI, LLM ou modelo científico de pessoas. Não acessa rede, contas, dispositivos, dados pessoais ou ferramentas externas. Limites de 120 bots, 10.000 ciclos e buffers de memória tornam a execução delimitada. Ctrl+C permite interrupção.

## Referências conceituais

- Harlan Ellison, *I Have No Mouth, and I Must Scream* (1967): inspiração temática, sem reprodução da obra.
- [NetLogo](https://www.netlogo.org/): modelagem baseada em agentes.
- [Generative Agents (2023)](https://arxiv.org/abs/2304.03442): observação e memória de agentes; este projeto não implementa a arquitetura generativa do artigo.

A versão 3 substitui a campanha antiga pelo motor autônomo em código. O histórico Git preserva as versões anteriores.
