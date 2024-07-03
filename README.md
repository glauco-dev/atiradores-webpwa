# atiradores-webpwa (atiradores-webpwa)

Progressive web application for atiradores of Bahia Brazil

Constituido de:
- Tela de login e registro
- Tela inicial, com informações e foto, tal como histórico de participações registradas
- Tela para registro de pontuação em pista
- Tela de campeonatos presentes, dividos em categorias
- Tela de campeonato: banner, timeline das pistas com squads

-- Como capitão (membro)
- registrar squad em campeonato, torna-o capitão de um squad assim, squads em que vc é o capitão são mostrados na sua tela inicial.
- Squads ativos apresentam uma tela que mostram um resumo das pontuações dos membros, campeonato e pista que estão, essa tela tem um tab viewer que slide para o lado nome a nome de membro. Cada membro terá uma tela de pontuação para a pista e então um botão de finalizar pista fica disponibilizado na tela inicial.

O esquema de pontuação é de alfas, charlies, deltas, no shoots, misses, decays e procedimentos. Onde decay o desclassifica do campeonato, finalizando sua participação e procedimento anula a pista.
Alfa = 10 pts.
Charlie = 5 pts.
Delta = 1pts
No shoots = -10 pts

Campeonatos já encerrados ficam levemente apagados no fundo da tela de campeonatos, registrando apenas (em seu accordion) os vencedores, suas pontuações, banners públicos e o squad de que participaram.

Há o portal de administrador, com o nível de autentificação elevado, que tem a tela de campeonatos como a inicial e que podem criar campeonatos: datas, banner, localidade e montador de pistas.