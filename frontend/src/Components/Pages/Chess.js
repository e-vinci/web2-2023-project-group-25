import Phaser from 'phaser';
import GameScene from '../ChessGame/indexbeta2';

let game;

const createCheckerboardScene = () => {
  const phaserGame = `
    <div id="gameDiv" class="game-container d-flex justify-content-center my-3">
    </div>
  `;

  const main = document.querySelector('main');
  main.innerHTML = phaserGame;

  const config = {
    type: Phaser.AUTO,
    width: 644,
    height: 644,
    scene: [GameScene],
    parent: 'gameDiv',
  };

  if (game) game.destroy(true);
  game = new Phaser.Game(config);
};

export default createCheckerboardScene;
