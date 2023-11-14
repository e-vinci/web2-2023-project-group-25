import { clearPage } from '../../utils/render';

const GameDetails = async () => {
  clearPage();

  // const urlParams = new URLSearchParams(window.location.search);
  // const gameId = urlParams.get('id');

  // const gameDetails = await fetch(`http://localhost:3000/games/${gameId}`).then((response) => {
  //   if (!response.ok) throw new Error(`fetch error : ${response.status} : ${response.statusText}`);
  //   return response.json();
  // });

  const main = document.querySelector('main');
  main.innerHTML = 'vezudbhh';
};

export default GameDetails;

// TODO: Verifier la session utilisateur pour voir si il est autorisé a voir ça
