import Phaser from 'phaser';
import caseBlanche from '../../assets/blanc.png';
import caseNoir from '../../assets/noir.png';
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

const tailleCase = 80;
const lignes = 8;
const colonnes = 8;

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.clickedCase = null; // Utilisez this pour stocker l'état de la case sélectionnée
        this.piecesSelec = null;
        this.whitetime = true;
    }

    preload() {
        this.load.image('case_blanche', caseBlanche);
        this.load.image('case_noire', caseNoir);

        this.load.image('BBishop',BBishop);
        this.load.image('BKnight',BKnight);
        this.load.image('BPawn',BPawn);
        this.load.image('BQueen',BQueen);
        this.load.image('BRook',BRook);
        this.load.image('BKing',BKing);

        this.load.image('WBishop',WBishop);
        this.load.image('WKing',WKing);
        this.load.image('WPawn',WPawn);
        this.load.image('WKnight',WKnight);
        this.load.image('WQueen',WQueen);
        this.load.image('WRook',WRook);

    }

    create() {
        

        this.cases = [];
        this.pieces = [];

        const pieceLayout = [
            ['BRook', 'BKnight', 'BBishop', 'BQueen', 'BKing', 'BBishop', 'BKnight', 'BRook'],
            ['BPawn', 'BPawn', 'BPawn', 'BPawn', 'BPawn', 'BPawn', 'BPawn', 'BPawn'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['WPawn', 'WPawn', 'WPawn', 'WPawn', 'WPawn', 'WPawn', 'WPawn', 'WPawn'],
            ['WRook', 'WKnight', 'WBishop', 'WQueen', 'WKing', 'WBishop', 'WKnight', 'WRook']
        ];

       for (let i = 0; i < lignes; i++) {
            for (let j = 0; j < colonnes; j++) {
                const caseX = j * tailleCase + 0.5151 * tailleCase;
                const caseY = i * tailleCase + 0.5151 * tailleCase;

                const imageKey = (i + j) % 2 === 0 ? 'case_blanche' : 'case_noire';
                const case2 = this.add.image(caseX, caseY, imageKey).setDisplaySize(tailleCase, tailleCase);
                case2.setInteractive();
                case2.on('pointerdown', () => {
                    if (this.clickedCase === null) {
                        // Si aucune pièce n'est sélectionnée
                        const clickedPiece = this.findPieceByCoordinates(j, i);
    
                        if (clickedPiece) {
                            // Si une pièce est trouvée sur la case
                            if ((this.whitetime && clickedPiece.couleur === 'blanc') || (!this.whitetime && clickedPiece.couleur === 'noir')) {
                                // Si la pièce est de la bonne couleur en fonction de whitetime
                                this.clickedCase = { x: j, y: i, image: case2 };
                                case2.setTint(0xccd9ff);
                                console.log('Case sélectionnée 1:', j, i);
                            } else {
                                console.log('La pièce n\'est pas de la bonne couleur.');
                            }
                        } else {
                            console.log('Aucune pièce sur la case sélectionnée.');
                        }
                    } else {
                        // Si une pièce est déjà sélectionnée
                        const clickedPiece = this.findPieceByCoordinates(j, i);
                        if (this.clickedCase.x === j && this.clickedCase.y === i) {
                            // Dé-sélectionnez la case en cliquant à nouveau dessus
                            this.clickedCase.image.clearTint();
                            this.clickedCase = null;
                        }else if (clickedPiece) {
                            // Si une pièce est trouvée sur la case
                            if ((this.whitetime && clickedPiece.couleur === 'noir') || (!this.whitetime && clickedPiece.couleur === 'blanc')) {
                                // Si la pièce est de la bonne couleur en fonction de whitetime
                                if (this.movePiece(this.findPieceByCoordinates(this.clickedCase.x, this.clickedCase.y), j, i)) {
                                    console.log('Case sélectionnée 2:', j, i);
                                } else {
                                    console.log('Le déplacement de la pièce a échoué.');
                                }
                            } else {
                                console.log('La pièce n\'est pas de la bonne couleur.');
                            }
                        } else if (this.movePiece(this.findPieceByCoordinates(this.clickedCase.x, this.clickedCase.y), j, i)) {
                        // S'il n'y a aucune pièce sur la case
                            console.log('Case sélectionnée :', j, i);
                        } else {
                            console.log('Le déplacement de la pièce a échoué.');
                        } 
                    }
                });
    
                    
                this.cases.push({ x: j, y: i, image: case2 });

                const pieceName = pieceLayout[i][j];
                if( pieceName){
                    const couleur = (i < 3) ? 'noir' : 'blanc';

                    const pieceImage = this.add.image(caseX, caseY, pieceName).setDisplaySize(tailleCase, tailleCase);
                    this.pieces.push({ x: j, y: i, image: pieceImage, couleur });
                }
                
            }
        }
        
        
    }

   
    findPieceByCoordinates(x, y) {
        return this.pieces.find(piece => piece.x === x && piece.y === y);
    }  
    
    movePiece(piece, newX, newY) {
        const index = this.pieces.findIndex(p => p === piece);
    
        if (index !== -1) {
            // Vérifiez si la nouvelle position est valide (par exemple, dans les limites du plateau de jeu)
            if (newX >= 0 && newY >= 0 && newX < colonnes && newY < lignes) {
                // Récupérez la pièce existante
                const existingPiece = this.pieces[index];
    
                // Supprimez l'image de la pièce du plateau
                existingPiece.image.destroy();
    
                // Créez une nouvelle image pour la pièce à la nouvelle position
                const newPieceImage = this.add.image(newX * tailleCase + 0.5151 * tailleCase, newY * tailleCase + 0.5151 * tailleCase, existingPiece.image.texture.key).setDisplaySize(tailleCase, tailleCase);
    
                // Créez la nouvelle pièce
                const updatedPiece = { ...piece, x: newX, y: newY, image: newPieceImage };
    
                // Mettez à jour la pièce dans le tableau pieces
                this.pieces[index] = updatedPiece;
                this.clickedCase.image.clearTint();
                this.clickedCase = null;
                if(this.whitetime){
                    this.whitetime = false;
                }else{
                    this.whitetime = true;
                }
                return true; // Déplacement réussi
            }
        }
    
        return false; // Déplacement échoué
    }
    
    
    // highlightAllowedMoves(selectedPiece, pieces) {
    //     const allowedMoves = calculateAllowedMoves(selectedPiece, pieces);
    
    //     // Parcourez les cases autorisées et changez leur couleur
    //     allowedMoves.forEach(move => {
    //         const { x, y } = move;
    //         const caseToUpdate = this.cases.find(c => c.x === x && c.y === y);
    
    //         if (caseToUpdate) {
    //             caseToUpdate.image.setTint(0x00FF00); // Par exemple, définissez la couleur en vert
    //         }
    //     });
    // }
    
    // resetCaseColors() {
    //     // Réinitialisez la couleur de toutes les cases
    //     this.cases.forEach(caseData => {
    //         caseData.image.clearTint();
    //     });
    // }
    
    
    // update() {
    //     if (this.clickedCase) {
    //         console.log('Case sélectionnée :', this.clickedCase.x, this.clickedCase.y);
    //         // Vous pouvez maintenant gérer la sélection et le déplacement de pièces ici
            
    //     }
    // }
}

export default GameScene;
