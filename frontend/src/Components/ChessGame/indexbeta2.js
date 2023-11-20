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
        this.selectedPiece = null;
        this.whitetime = true;
        this.forbiddenMovesWhiteKing = [];
        this.forbiddenMovesBlackKing = [];
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
                                this.selectedPiece = clickedPiece;
                                case2.setTint(0xccd9ff);
                                this.highlightAllowedMoves();
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
                            this.resetCaseColors();
                            this.clickedCase = null;
                            this.selectedPiece = null;

                        }else if (clickedPiece) {
                            // Si une pièce est trouvée sur la case
                            if ((this.whitetime && clickedPiece.couleur === 'noir') || (!this.whitetime && clickedPiece.couleur === 'blanc')) {
                                // Si la pièce est de la bonne couleur en fonction de whitetime
                                if (this.movePiece(this.selectedPiece, j, i)) {
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

    findPieceWithGoodColor(x,y){
        const targetColor = this.whitetime ? 'noir' : 'blanc';
        return this.pieces.find(piece => piece.x === x && piece.y === y && piece.couleur === targetColor);
    }
    
    movePiece(piece, newX, newY) {
        const index = this.pieces.findIndex(p => p === piece);
        
        if (index !== -1) {
            // Vérifiez si la nouvelle position est valide (par exemple, dans les limites du plateau de jeu)
            if (newX >= 0 && newY >= 0 && newX < colonnes && newY < lignes && this.validate(newX,newY)) {
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
                this.resetCaseColors();
                this.clickedCase = null;
                this.selectedPiece = null;
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
    
    highlightAllowedMoves() {
        const allowedMoves = this.calculateAllowedMoves(this.selectedPiece);
    
        // Parcourez les cases autorisées et changez leur couleur
        allowedMoves.forEach(move => {
            const { x, y } = move;
            const caseToUpdate = this.cases.find(c => c.x === x && c.y === y);
    
            if (caseToUpdate) {
                caseToUpdate.image.setTint(0x00FF00); // Par exemple, définissez la couleur en vert
            }
        });
    }

    validate(x,y){
        const allowedMoves = this.calculateAllowedMoves(this.selectedPiece);
        if(allowedMoves.find(m => m.x ===x && m.y ===y))return true;
        return false;
    }
     
    calculateAllowedMoves(selectedPiece) {
        const allowedMoves = [];
        
        // Ajoutez des conditions spécifiques pour le pion
        if (selectedPiece && (selectedPiece.image.texture.key === 'BPawn' || selectedPiece.image.texture.key === 'WPawn')) {
            // Déplacement vers l'avant (1 case)
            const forwardMove = { x: selectedPiece.x, y: selectedPiece.y + (selectedPiece.couleur === 'blanc' ? -1 : 1) };
            if (this.isMoveValid(forwardMove)) {
                allowedMoves.push(forwardMove);

                // Déplacement spécial pour le premier déplacement (2 cases)
                const doubleForwardMove = { x: selectedPiece.x, y: selectedPiece.y + (selectedPiece.couleur === 'blanc' ? -2 : 2) };
                if (this.isMoveValid(doubleForwardMove) && ((selectedPiece.couleur === 'blanc' && selectedPiece.y === 6) || (selectedPiece.couleur === 'noir' && selectedPiece.y === 1))) {
                    allowedMoves.push(doubleForwardMove);
                }
            }
            // Capture en diagonale à gauche
            const captureLeftMove = { x: selectedPiece.x - 1, y: selectedPiece.y + (selectedPiece.couleur === 'blanc' ? -1 : 1) };
            if (this.isCaptureValid(captureLeftMove)) {
                allowedMoves.push(captureLeftMove);
            }
            // Capture en diagonale à droite
            const captureRightMove = { x: selectedPiece.x + 1, y: selectedPiece.y + (selectedPiece.couleur === 'blanc' ? -1 : 1) };
            if (this.isCaptureValid(captureRightMove)) {
                allowedMoves.push(captureRightMove);
            }
        }
        // Ajoutez des conditions spécifiques pour la tour
        if (selectedPiece && (selectedPiece.image.texture.key === 'BRook' || selectedPiece.image.texture.key === 'WRook'||selectedPiece.image.texture.key === 'BQueen' || selectedPiece.image.texture.key === 'WQueen')) {
            // Mouvement vertical vers le haut
            for (let i = selectedPiece.y - 1; i >= 0; i--) {
                const move = { x: selectedPiece.x, y: i };
                if (this.isMoveValid(move)|| this.isCaptureValid(move)) {
                    allowedMoves.push(move);
                    if (this.findPieceWithGoodColor(move.x, move.y)) {
                        // Si la tour rencontre une pièce de sa propre couleur, arrêtez le mouvement vertical vers le haut
                        break;
                    }
                } else {
                    // Si le mouvement vertical n'est pas valide, arrêtez le mouvement vertical vers le haut
                    break;
                }
            }
    
            // Mouvement vertical vers le bas
            for (let i = selectedPiece.y + 1; i < lignes; i++) {
                const move = { x: selectedPiece.x, y: i };
                if (this.isMoveValid(move)|| this.isCaptureValid(move)) {
                    allowedMoves.push(move);
                    if (this.findPieceWithGoodColor(move.x, move.y)) {
                        // Si la tour rencontre une pièce de sa propre couleur, arrêtez le mouvement vertical vers le bas
                        break;
                    }
                } else {
                    // Si le mouvement vertical n'est pas valide, arrêtez le mouvement vertical vers le bas
                    break;
                }
            }
    
            // Mouvement horizontal
            for (let i = selectedPiece.x + 1; i < colonnes; i++) {
                const move = { x: i, y: selectedPiece.y };
                if (this.isMoveValid(move) || this.isCaptureValid(move)) {
                    allowedMoves.push(move);
                    if (this.findPieceWithGoodColor(move.x, move.y)) {
                        // Si la tour rencontre une pièce de sa propre couleur, arrêtez le mouvement horizontal vers la droite
                        break;
                    }
                } else {
                    // Si le mouvement horizontal n'est pas valide, arrêtez le mouvement horizontal vers la droite
                    break;
                }
            }
            for (let i = selectedPiece.x - 1; i >= 0; i--) {
                const move = { x: i, y: selectedPiece.y };
                if (this.isMoveValid(move)|| this.isCaptureValid(move)) {
                    allowedMoves.push(move);
                    if (this.findPieceWithGoodColor(move.x, move.y)) {
                        // Si la tour rencontre une pièce de sa propre couleur, arrêtez le mouvement horizontal vers la gauche
                        break;
                    }
                } else {
                    // Si le mouvement horizontal n'est pas valide, arrêtez le mouvement horizontal vers la gauche
                    break;
                }
            }
        }
        // Ajoutez des conditions spécifiques pour le fou
        if (selectedPiece && (selectedPiece.image.texture.key === 'BBishop' || selectedPiece.image.texture.key === 'WBishop'||selectedPiece.image.texture.key === 'BQueen' || selectedPiece.image.texture.key === 'WQueen')) {
            // Déplacement en diagonale en haut à gauche
            this.addDiagonalMoves(allowedMoves, selectedPiece, -1, -1);
    
            // Déplacement en diagonale en haut à droite
            this.addDiagonalMoves(allowedMoves, selectedPiece, 1, -1);
    
            // Déplacement en diagonale en bas à gauche
            this.addDiagonalMoves(allowedMoves, selectedPiece, -1, 1);
    
            // Déplacement en diagonale en bas à droite
            this.addDiagonalMoves(allowedMoves, selectedPiece, 1, 1);
        }
        // Ajoutez des conditions spécifiques pour le cavalier
        if (selectedPiece && (selectedPiece.image.texture.key === 'BKnight' || selectedPiece.image.texture.key === 'WKnight')) {
            // Ajouter les mouvements en L possibles pour le cavalier
            this.addKnightMoves(allowedMoves, selectedPiece, -2, -1);
            this.addKnightMoves(allowedMoves, selectedPiece, -2, 1);
            this.addKnightMoves(allowedMoves, selectedPiece, -1, -2);
            this.addKnightMoves(allowedMoves, selectedPiece, -1, 2);
            this.addKnightMoves(allowedMoves, selectedPiece, 1, -2);
            this.addKnightMoves(allowedMoves, selectedPiece, 1, 2);
            this.addKnightMoves(allowedMoves, selectedPiece, 2, -1);
            this.addKnightMoves(allowedMoves, selectedPiece, 2, 1);
        }

        if (selectedPiece && (selectedPiece.image.texture.key === 'BKing' || selectedPiece.image.texture.key === 'WKing')) {
            // Ajouter les mouvements possibles pour le roi
            // const allowedMovesOpponent = this.getAllowedMovesForOpponent(this.pieces)
            this.addKingMoves(allowedMoves, selectedPiece, -1, -1);
            this.addKingMoves(allowedMoves, selectedPiece, -1, 0);
            this.addKingMoves(allowedMoves, selectedPiece, -1, 1);
            this.addKingMoves(allowedMoves, selectedPiece, 0, -1);
            this.addKingMoves(allowedMoves, selectedPiece, 0, 1);
            this.addKingMoves(allowedMoves, selectedPiece, 1, -1);
            this.addKingMoves(allowedMoves, selectedPiece, 1, 0);
            this.addKingMoves(allowedMoves, selectedPiece, 1, 1);
        }
        return allowedMoves;
    }
    
    isMoveValid(move) {
        
        // Ajoutez des conditions pour vérifier si le mouvement est valide
        return move.x >= 0 && move.x < colonnes && move.y >= 0 && move.y < lignes && !this.findPieceByCoordinates(move.x,move.y);
    }
    
    isCaptureValid(move) {
        // Ajoutez des conditions pour vérifier si la capture est valide
        return move.x >= 0 && move.x < colonnes && move.y >= 0 && move.y < lignes && this.findPieceWithGoodColor(move.x,move.y);
    }
    
    addDiagonalMoves(allowedMoves, selectedPiece, directionX, directionY) {
        for (let i = 1; i < Math.min(colonnes, lignes); i++) {
            const move = { x: selectedPiece.x + i * directionX, y: selectedPiece.y + i * directionY };
    
            if (!this.isMoveValid(move)&& !this.isCaptureValid(move)) {
                break; // Sortir de la boucle si le mouvement n'est pas valide
            }
    
            allowedMoves.push(move);
    
            if (this.findPieceByCoordinates(move.x, move.y)) {
                break; // Sortir de la boucle si une pièce est rencontrée
            }
        }
    }

    addKnightMoves(allowedMoves, selectedPiece, offsetX, offsetY) {
        const move = { x: selectedPiece.x + offsetX, y: selectedPiece.y + offsetY };
    
        if (this.isMoveValid(move)||this.isCaptureValid(move)) {
            allowedMoves.push(move);
        }
    }

    addKingMoves(allowedMoves, selectedPiece, offsetX, offsetY) {
        const move = { x: selectedPiece.x + offsetX, y: selectedPiece.y + offsetY };
    
        if ((this.isMoveValid(move)||this.isCaptureValid(move) )) {
            allowedMoves.push(move);
        }
    }

    // isMoveInForbiddenArray(move) {
    //     const forbiddenMovesArray = this.whiteTime ? this.forbiddenMovesWhiteKing : this.forbiddenMovesBlackKing;
    //     return forbiddenMovesArray.some(forbiddenMove => forbiddenMove.x === move.x && forbiddenMove.y === move.y);
    // }

    // updateForbiddenMoves(piece, oldX, oldY) {
    //     // Supprimez les anciennes cases interdites de la pièce déplacée
    //     const forbiddenMovesArray = piece.couleur === 'blanc' ? this.forbiddenMovesBlackKing : this.forbiddenMovesWhiteKing;
    //     const oldMovesIndex = forbiddenMovesArray.findIndex(move => move.x === oldX && move.y === oldY);
    //     if (oldMovesIndex !== -1) {
    //         forbiddenMovesArray.splice(oldMovesIndex, 1);
    //     }
    
    //     // Ajoutez les nouvelles cases interdites de la pièce déplacée
    //     const newMoves = this.calculateAllowedMoves(piece);
    //     newMoves.forEach(move => {
    //         forbiddenMovesArray.push(move);
    //     });
    // }
    // , allowedMovesForOpponent
    // && !this.isMoveInArray(move, allowedMovesForOpponent)
    // /* eslint-disable class-methods-use-this */
    // isMoveInArray(move, movesArray) {
    //     return movesArray.some(allowedMove => allowedMove.x === move.x && allowedMove.y === move.y);
    // }
    // /* eslint-enable class-methods-use-this */

    // getAllowedMovesForOpponent(pieces) {
    //     const allowedMovesForOpponent = [];
    
    //     pieces
    //         .filter(piece => piece.couleur === (this.whiteTime ? 'noir' : 'blanc'))
    //         .forEach(piece => {
    //             // Exclure le roi adverse du calcul des mouvements autorisés
    //             if (piece.image.texture.key !== (this.whiteTime ? 'WKing' : 'BKing')) {
    //                 const allowed = this.calculateAllowedMoves(piece);
    //                 allowedMovesForOpponent.push(...allowed);
    //             }
    //         });
    
    //     return allowedMovesForOpponent;
    // }
    
    

    resetCaseColors() {
         // Réinitialisez la couleur de toutes les cases
         this.cases.forEach(caseData => {
             caseData.image.clearTint();
         });
    }
    
    
    // update() {
    //     if (this.clickedCase) {
    //         console.log('Case sélectionnée :', this.clickedCase.x, this.clickedCase.y);
    //         // Vous pouvez maintenant gérer la sélection et le déplacement de pièces ici
            
    //     }
    // }
}

export default GameScene;
