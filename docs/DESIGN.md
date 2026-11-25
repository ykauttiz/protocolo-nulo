# Documento de design — Protocolo Nulo

## Pesquisa e decisões

| Fonte | Aplicação |
|---|---|
| [Emory University — And I Must Scream](https://carlos.emory.edu/publications/AndIMustScream/essays/essay1/) | Dependência tecnológica e desumanização como ponto de partida temático. |
| [Masaryk University — The Illusion of Free Will](https://www.muni.cz/en/research/publications/2567820) | Autonomia como eixo narrativo, com escolhas genuínas no jogo. |
| [Game Developer — Decisions that matter in Orwell](https://www.gamedeveloper.com/design/game-design-deep-dive-decisions-that-matter-in-i-orwell-i-) | Consequências visíveis, ambiguidade institucional e informação contextual. |
| [MIT Docubase — Papers, Please](https://docubase.mit.edu/project/papers-please/) | A burocracia como ambiente narrativo e a tensão entre procedimento e contexto. |
| [UNESCO — Recommendation on the Ethics of AI](https://www.unesco.org/en/legal-affairs/recommendation-ethics-artificial-intelligence) | Privacidade, transparência, contestação, supervisão humana. |
| [NIST AI RMF Playbook](https://airc.nist.gov/airmf-resources/playbook/) | Revisão de impacto e governança verificável como temas ficcionais. |
| [MDN — Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API) | Persistência local com tratamento de falhas. |
| [MDN — Accessible web applications](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Accessible_web_applications_and_widgets) | Botões nativos, foco e navegação pelo teclado. |
| [GitHub Pages — publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) | Distribuição de aplicação estática sem servidor. |

## Arquitetura

`story.js` é a fonte canônica da campanha. `engine.js` é uma máquina de estados com transições puras, validação de decisões e limites dos indicadores. `app.js` é um adaptador DOM que renderiza estado e persiste escolhas. Não existe código de controle social real, integração com bancos de dados de cidadãos ou serviço remoto.

Uma rodada possui um capítulo, uma situação, um depoimento e três decisões. Uma decisão indisponível por falta de evidências aparece desabilitada. A última escolha define a proposta institucional, mas o resultado também depende dos indicadores e das decisões anteriores. Relações com personagens são feedback narrativo, não condições de vitória nesta versão.

## Limitações e próximos passos

- Campanha linear em capítulos com consequências ramificadas no estado, não uma árvore de cenas completamente distinta.
- Sem dublagem, multiplayer, IA generativa, mapas 3D ou backend.
- Indicadores determinísticos, não um modelo sociológico validado.
- Próximas expansões: cenas condicionais por personagem, tradução, testes automatizados em navegadores, trilha sonora original e revisão de acessibilidade com usuários.
- O nome escolhido é provisório até pesquisa de marca; os textos não usam personagens ou diálogos de obras existentes.
