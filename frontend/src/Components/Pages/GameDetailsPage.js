import Phaser from 'phaser';
import GameScene from '../History/GameBoard';
import { clearPage } from '../../utils/render';

let game;

const GameDetailsPage = async () => {
  clearPage();

  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('id');

  // TODO: Gérer fail to fetch
  const gameData = await fetch(`http://localhost:3000/games/${gameId}`).then((response) => {
    if (!response.ok) throw new Error(`fetch error : ${response.status} : ${response.statusText}`);
    return response.json();
  });

  let moves = gameData.moves.split(';');
  moves = moves.map((move) => {
    const [piece, coordinates] = move.split(':');
    const [sourceCoord, destCoord] = coordinates.split('-');
    return { piece, sourceCoord, destCoord };
  });

  const main = document.querySelector('main');
  main.innerHTML = `
  <div class="row">
    <div id="gameDiv" class="col game-container d-flex justify-content-center my-3"></div>
    <div class="col container">${moves.map(
      (move) => `<div class="row">${move.piece}, ${move.sourceCoord}, ${move.destCoord}</div>`,
    )}</div>
  <div>
  `;

  const config = {
    type: Phaser.AUTO,
    width: 560,
    height: 600,
    scene: [GameScene],
    parent: 'gameDiv',
  };

  if (game) game.destroy(true);
  game = new Phaser.Game(config);

  const checkScenes = () => {
    if (game.scene.getScene('GameScene')) {
      game.scene.getScene('GameScene').initData(gameData.moves);
    } else {
      setTimeout(checkScenes, 100);
    }
  };

  checkScenes();
};

export default GameDetailsPage;

// TODO: Verifier la session utilisateur pour voir si il est autorisé a voir ça
