# VÉRTICE / Laboratório autônomo

Uma extensão original de Protocolo Nulo, inspirada em questões sobre autonomia e inteligência artificial na ficção científica. Não adapta personagens ou enredos existentes.

Abra `autonomo.html` no navegador e pressione **Iniciar simulação**. O mundo evolui por ciclos sem escolhas humanas. Até 60 agentes computacionais avaliam ações a partir de atributos individuais, recursos coletivos e retornos anteriores. Um núcleo seleciona prioridades abstratas do ambiente. O histórico e a memória de cada agente podem ser inspecionados.

## Implementação

- `autonomo/core.mjs`: modelo baseado em agentes, gerador pseudoaleatório com semente, decisões por utilidade e atualização dos valores por reforço simples.
- `autonomo/template.html`: interface de monitoramento.
- `autonomo/build.mjs`: gera o HTML independente (`node autonomo/build.mjs`).
- `tests/autonomo.test.js`: seis testes, incluindo 500 ciclos e reprodutibilidade.

O motor é determinístico para a mesma semente e número de agentes. Não utiliza LLMs, aprendizado profundo, APIs, acesso a ferramentas, dados reais, rede ou controle externo. O modo de execução tem pausa e limite de 10.000 ciclos. A política de segurança do HTML bloqueia conexões de rede. As métricas são abstrações experimentais e não representam pessoas reais.

Referências conceituais: [NetLogo — modelagem baseada em agentes](https://www.netlogo.org/about/) e [Park et al. — Generative Agents (2023)](https://arxiv.org/abs/2304.03442). A arquitetura não reproduz o modelo generativo descrito nesse artigo; aplica apenas a ideia geral de observação, memória e planejamento.
