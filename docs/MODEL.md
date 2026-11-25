# Modelo e protocolo experimental

## Objetivo e entidades

VÉRTICE é um experimento de ficção computacional sobre a diferença entre um indicador de desempenho e o conjunto de resultados desejáveis. Seguindo a estrutura Overview, Design concepts, Details (ODD), descrevemos agentes, estado, ordem de atualização e hipóteses. Não é um modelo calibrado da sociedade humana.

- Núcleo: política abstrata, estimativas de retorno e memória limitada.
- Agentes: identificador sintético, papel, curiosidade, sociabilidade, energia, conhecimento, afinidade, ação e estimativas de retorno.
- Ambiente: cinco indicadores abstratos limitados a 0–100.
- Tempo: ciclos discretos, mesma fotografia ambiental para todas as decisões; efeitos agregados após planejamento. A difusão de conhecimento usa valores individuais anteriores ao ciclo.
- Inicialização: gerador pseudoaleatório com semente de 32 bits. A repetição de configuração e semente reproduz a trajetória.
- Aprendizagem: atualização exponencial de estimativas de recompensa. Não há rede neural, modelo de linguagem ou consciência.
- Observação: contagens de ações, entropia normalizada, duração das contradições, distribuição do conhecimento e comparações descritivas de cenários.

## Experimento

`node src/experiment-cli.mjs --seed 2189 --bots 36 --ticks 250 --replicates 8`

Executa 16 simulações, com 8 sementes compartilhadas entre cenários. Os cenários possuem regras distintas definidas no código; não demonstram que um sistema tenha adquirido intenções. As sementes são consecutivas e a amostra é pequena. Estatísticas descritivas são calculadas sobre diferenças pareadas; não há teste inferencial. Os indicadores do cenário fictício não são medidas validadas de direitos humanos, nem instrumentos de decisão sobre pessoas.

Resultados locais em Node 22.16.0 (médias finais arredondadas):

| Indicador | Equilíbrio | Paradoxo |
|---|---:|---:|
| Energia | 66,21 | 46,55 |
| Conhecimento | 100,00 | 53,13 |
| Coesão | 100,00 | 100,00 |
| Pluralidade | 84,04 | 37,70 |
| Estabilidade | 76,13 | 100,00 |

A contradição convencional ocorreu em média durante 93,55% dos ciclos no cenário paradoxo e 0% no equilíbrio. A saturação de alguns indicadores evidencia uma limitação do modelo. Os resultados decorrem das hipóteses programadas, não são previsões nem evidências sobre uma sociedade real.

## Referências

- Grimm et al. (2020), [ODD protocol](https://doi.org/10.18564/jasss.4259): documentação explícita de modelos baseados em agentes.
- [A Common Protocol for Agent-Based Social Simulation](https://www.jasss.org/9/1/15.html): repetição de simulações e análise de sensibilidade.
- Sutton & Barto (2018), [Reinforcement Learning: An Introduction](http://incompleteideas.net/book/the-book-2nd.html): estimativas incrementais de valor.
- DeepMind (2020), [Specification gaming](https://deepmind.google/blog/specification-gaming-the-flip-side-of-ai-ingenuity/): distinção entre objetivo formal e intenção.

Sem rede, APIs, ferramentas externas ou entidades reais. O experimento possui orçamento máximo de 2 milhões de agente-ciclos e 32 réplicas. A execução pode ser interrompida pelo operador.
