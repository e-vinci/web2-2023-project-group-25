import Phaser from 'phaser';

import caseBlanche from '../../assets/blanc.png';
import caseNoir from '../../assets/noir.png';

import transparent from '../../assets/transparent.png';

import BBishop from '../../assets/piece/BBishop.png';
import BKing from '../../assets/piece/BKing.png';
import BKnight from '../../assets/piece/BKnight.png';
import BPawn from '../../assets/piece/BPawn.png';
import BQueen from '../../assets/piece/BQueen.png';
import BRook from '../../assets/piece/BRook.png';

import WBishop from '../../assets/piece/WBishop.png';
import WKing from '../../assets/piece/WKing.png';
import WPawn from '../../assets/piece/WPawn.png';
import WKnight from '../../assets/piece/WKnight.png';
import WQueen from '../../assets/piece/WQueen.png';
import WRook from '../../assets/piece/WRook.png';

const tailleCase = 70;

const align = (val) => {
  const value = val * tailleCase + 0.5 * tailleCase;
  return value;
};

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.pieces = [];
    this.moves = [];
    this.index = 0;
  }

  initData(data) {
    const moveStrings = data.split(';');

    this.moves = moveStrings.map((moveString) => {
      const [piece, coordStr] = moveString.split(':');
      const [sourceStr, destStr] = coordStr.split('-');
      const [sx, sy] = sourceStr.split(',').map(Number);
      const [dx, dy] = destStr.split(',').map(Number);

      return { piece, sourceCoord: { x: sx, y: sy }, destCoord: { x: dx, y: dy } };
    });
  }

  preload() {
    this.load.image('white_case', caseBlanche);
    this.load.image('black_case', caseNoir);

    this.load.image('empty', transparent);

    this.load.image('BBishop', BBishop);
    this.load.image('BKnight', BKnight);
    this.load.image('BPawn', BPawn);
    this.load.image('BQueen', BQueen);
    this.load.image('BRook', BRook);
    this.load.image('BKing', BKing);

    this.load.image('WBishop', WBishop);
    this.load.image('WKing', WKing);
    this.load.image('WPawn', WPawn);
    this.load.image('WKnight', WKnight);
    this.load.image('WQueen', WQueen);
    this.load.image('WRook', WRook);
  }

  create() {
    let whiteCase = true;
    for (let i = 0; i < 8; i += 1) {
      for (let j = 0; j < 8; j += 1) {
        this.add
          .image(
            j * tailleCase + 0.5 * tailleCase,
            i * tailleCase + 0.5 * tailleCase,
            whiteCase ? 'white_case' : 'black_case',
          )
          .setDisplaySize(tailleCase, tailleCase);
        whiteCase = !whiteCase;
      }
      whiteCase = !whiteCase;
    }

    this.initializePieces();

    const previousButton = this.add.text(100, 575, 'Previous move', { fill: '#0f0' });
    previousButton.setInteractive();
    previousButton.on('pointerdown', () => {
      if (this.index > 0) {
        this.index -= 1;
        this.movePiece(this.moves[this.index].piece, this.moves[this.index].sourceCoord);
      }
    });

    const nextButton = this.add.text(350, 575, 'Next move', { fill: '#0f0' });
    nextButton.setInteractive();
    nextButton.on('pointerdown', () => {
      if (this.index < this.moves.length) {
        this.movePiece(this.moves[this.index].piece, this.moves[this.index].destCoord);
        this.index += 1;
      }
    });
  }

  movePiece(piece, coordinates) {
    this.pieces[piece].x = align(coordinates.x);
    this.pieces[piece].y = align(coordinates.y);
  }

  initializePieces() {
    this.pieces.BRook1 = this.add
      .image(align(0), align(0), 'BRook')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.BKnight1 = this.add
      .image(align(1), align(0), 'BKnight')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.BBishop1 = this.add
      .image(align(2), align(0), 'BBishop')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.BQueen = this.add
      .image(align(3), align(0), 'BQueen')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.BKing = this.add
      .image(align(4), align(0), 'BKing')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.BBishop2 = this.add
      .image(align(5), align(0), 'BBishop')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.BKnight2 = this.add
      .image(align(6), align(0), 'BKnight')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.BRook2 = this.add
      .image(align(7), align(0), 'BRook')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.BPawn1 = this.add
      .image(align(0), align(1), 'BPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.BPawn2 = this.add
      .image(align(1), align(1), 'BPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.BPawn3 = this.add
      .image(align(2), align(1), 'BPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.BPawn4 = this.add
      .image(align(3), align(1), 'BPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.BPawn5 = this.add
      .image(align(4), align(1), 'BPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.BPawn6 = this.add
      .image(align(5), align(1), 'BPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.BPawn7 = this.add
      .image(align(6), align(1), 'BPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.BPawn8 = this.add
      .image(align(7), align(1), 'BPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.WRook1 = this.add
      .image(align(0), align(7), 'WRook')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.WKnight1 = this.add
      .image(align(1), align(7), 'WKnight')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.WBishop1 = this.add
      .image(align(2), align(7), 'WBishop')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.WQueen = this.add
      .image(align(3), align(7), 'WQueen')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.WKing = this.add
      .image(align(4), align(7), 'WKing')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.WBishop2 = this.add
      .image(align(5), align(7), 'WBishop')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.WKnight2 = this.add
      .image(align(6), align(7), 'WKnight')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.WRook2 = this.add
      .image(align(7), align(7), 'WRook')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.WPawn1 = this.add
      .image(align(0), align(6), 'WPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.WPawn2 = this.add
      .image(align(1), align(6), 'WPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.WPawn3 = this.add
      .image(align(2), align(6), 'WPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.WPawn4 = this.add
      .image(align(3), align(6), 'WPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.WPawn5 = this.add
      .image(align(4), align(6), 'WPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.WPawn6 = this.add
      .image(align(5), align(6), 'WPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.WPawn7 = this.add
      .image(align(6), align(6), 'WPawn')
      .setDisplaySize(tailleCase, tailleCase);
    this.pieces.WPawn8 = this.add
      .image(align(7), align(6), 'WPawn')
      .setDisplaySize(tailleCase, tailleCase);
  }
}

export default GameScene;
