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
        this.cases = [];
        this.pieces = [];
        this.whitetime = true;
        this.moves = [];
        this.WKingPosition = null;
        this.BKingPosition = null;

        this.ischeck = false;
        this.checkPiece = null;
        this.check = [];
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
                                if(!this.selectedPiece.blocked){
                                    this.highlightAllowedMoves();
                                }
                                
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
                            console.log('Case sélectionnée2 :', j, i);
                        } else {
                            console.log('Le déplacement de la pièce a échoué.');
                        } 
                    }
                });
    
                    
                this.cases.push({ x: j, y: i, image: case2 });

                const pieceName = pieceLayout[i][j];
                if( pieceName){
                    const couleur = (i < 3) ? 'noir' : 'blanc';
                    if(pieceName === 'BKing'){
                        const move = {x:j,y:i}
                        this.BKingPosition = move;
                        console.log(this.BKingPosition);
                    }
                    if(pieceName === 'WKing'){
                        const move = {x:j,y:i}
                        this.WKingPosition = move;
                        console.log(this.WKingPosition);
                    }

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
        let targetColor = this.whitetime ? 'noir' : 'blanc';
        if(this.isCheck){
            targetColor = this.whitetime ?  'blanc':'noir' ;
        }

    // Si en échec, inversez la couleur cible
        
        return this.pieces.find(piece => piece.x === x && piece.y === y && piece.couleur === targetColor);
    }
    
    movePiece(piece, newX, newY) {
        let index = this.pieces.findIndex(p => p === piece);
        
        if(piece.blocked){
            return false;
        }
        
        if (index !== -1) {
            // Vérifiez si la nouvelle position est valide (par exemple, dans les limites du plateau de jeu)
            if (newX >= 0 && newY >= 0 && newX < colonnes && newY < lignes && this.validate(newX, newY) ) {
                const existingPieceAtNewPos = this.findPieceByCoordinates(newX, newY);
                
                if (existingPieceAtNewPos) {
                    // Supprimez l'image de la pièce existante à la nouvelle position du plateau
                    existingPieceAtNewPos.image.destroy();
    
                    // Supprimez la pièce existante de la table pieces
                    const existingPieceIndex = this.pieces.findIndex(p => p === existingPieceAtNewPos);
                    if (existingPieceIndex !== -1) {
                        this.pieces.splice(existingPieceIndex, 1);
                        index = this.pieces.findIndex(p => p === piece);
                    }
                }
                console.log("Pièce à capturer : ", existingPieceAtNewPos);

                // Récupérez la pièce existante
                const existingPiece = this.pieces[index];
    
                // Supprimez l'image de la pièce du plateau
                existingPiece.image.destroy();
    
                // Créez une nouvelle image pour la pièce à la nouvelle position
                const newPieceImage = this.add.image(newX * tailleCase + 0.5151 * tailleCase, newY * tailleCase + 0.5151 * tailleCase, existingPiece.image.texture.key).setDisplaySize(tailleCase, tailleCase);
    
                // Créez la nouvelle pièce
                const updatedPiece = { ...piece, x: newX, y: newY, image: newPieceImage };
    
                // Mettez à jour la pièce dans le tableau pieces en utilisant splice
                this.pieces.splice(index, 1, updatedPiece);
                if(this.checkPiece){
                    // Bloquez les mouvements de la pièce bougée uniquement si elle protège le roi
                    console.log('La pièce', updatedPiece.image.texture.key, 'bloque le check au roi.');
                    updatedPiece.blocked = true;
                    this.checkPiece = null;
                    this.isCheck = false;
                }
                if(this.inCheck(updatedPiece)){
                    this.checkPiece = this.pieces[index];
                    this.isCheck = true;
                    
                    console.log('Le roi est en échec !');
                    
                    
                }
                
                
                

                this.resetCaseColors();
                this.clickedCase = null;
                this.selectedPiece = null;
                if (this.whitetime) {
                    this.whitetime = false;
                } else {
                    this.whitetime = true;
                }
    
                this.moves += `${piece.image.texture.key}:${piece.x},${piece.y}-${newX},${newY};`;
                console.log(this.moves);
                return true; // Déplacement réussi
            }
        }
    
        return false; // Déplacement échoué
    }
    
    
    highlightAllowedMoves() {
        let allowedMoves = this.calculateAllowedMoves(this.selectedPiece);
        if (this.checkPiece) {
            // Si une pièce met en échec, filtrez les mouvements valides
            const piece = this.checkPiece;
            this.checkPiece = null;
            const validMoves = allowedMoves.filter(move => {
                // Simulez chaque mouvement comme s'il y avait le type de la pièce qui met en échec
                const tempPiece = { ...piece, x: move.x, y: move.y };
                console.log('temp',tempPiece);
                // Vérifiez si la simulation conduit toujours à une situation d'échec
                return this.inCheck2(tempPiece);
            });
            console.log('checktableau',validMoves);
            
            allowedMoves = validMoves;
            
        }
        // Parcourez les cases autorisées et changez leur couleur
        allowedMoves.forEach(move => {
            const { x, y } = move;
            const caseToUpdate = this.cases.find(c => c.x === x && c.y === y);
    
            if (caseToUpdate) {
                caseToUpdate.image.setTint(0x00FF00); // la couleur en vert
            }
        });
    }

    validate(x,y){
        const allowedMoves = this.calculateAllowedMoves(this.selectedPiece);
        console.log('table',allowedMoves)
        if (this.checkPiece) {
            // Si une pièce met en échec, filtrez les mouvements valides
            const piece = this.checkPiece;
            this.checkPiece = null;
            const validMoves = allowedMoves.filter(move => {
                // Simulez chaque mouvement comme s'il y avait le type de la pièce qui met en échec
                const tempPiece = { ...piece, x: move.x, y: move.y };
                console.log('temp',tempPiece);
                // Vérifiez si la simulation conduit toujours à une situation d'échec
                return this.inCheck2(tempPiece);
            });
            console.log('checktableau',validMoves);
            
            if(validMoves.find(m => m.x === x && m.y === y))return true;
            return false;
        }
        if(allowedMoves.find(m => m.x ===x && m.y ===y))return true;
        return false;
    }

    inCheck(piece) {
        const kingPosition = this.whitetime ? this.BKingPosition : this.WKingPosition;

        // Seulement pour la pièce passée en paramètre
        const allowedMoves = this.calculateAllowedMoves(piece);
        if(allowedMoves.find(move => move.x === kingPosition.x && move.y === kingPosition.y)){
            this.check = allowedMoves;
            return true;
        }

        return false;
    }

    inCheck2(piece) {
        const kingPosition = this.whitetime ? this.WKingPosition : this.BKingPosition;
        console.log(kingPosition);
        // Seulement pour la pièce passée en paramètre
        const allowedMoves = this.calculateAllowedMoves(piece);
        console.log("tempallowedmove",allowedMoves);
        if(allowedMoves.find(move => move.x === kingPosition.x && move.y === kingPosition.y)){
            this.check = allowedMoves;
            return true;
        }

        return false;
    }

    calculateAllowedMoves(selectedPiece) {
        const allowedMoves = [];
        
        // Ajoutez des conditions spécifiques pour le pion
        if (selectedPiece && (selectedPiece.image.texture.key === 'BPawn' || selectedPiece.image.texture.key === 'WPawn')) {
            // Déplacement vers l'avant (1 case)
            const forwardMove = { x: selectedPiece.x, y: selectedPiece.y + (selectedPiece.couleur === 'blanc' ? -1 : 1) };
            if (this.isMoveValid(forwardMove)) {
                if(this.checkPiece){
                    if(this.check.some(mov => mov.x === forwardMove.x && mov.y === forwardMove.y)){
                        allowedMoves.push(forwardMove);
                    }
                }else{
                   allowedMoves.push(forwardMove); 
                }

                // Déplacement spécial pour le premier déplacement (2 cases)
                const doubleForwardMove = { x: selectedPiece.x, y: selectedPiece.y + (selectedPiece.couleur === 'blanc' ? -2 : 2) };
                if (this.isMoveValid(doubleForwardMove) && ((selectedPiece.couleur === 'blanc' && selectedPiece.y === 6) || (selectedPiece.couleur === 'noir' && selectedPiece.y === 1))) {
                    if(this.checkPiece){
                        if(this.check.some(mov => mov.x === doubleForwardMove.x && mov.y === doubleForwardMove.y)){
                            allowedMoves.push(doubleForwardMove);
                        }
                    }else{
                       allowedMoves.push(doubleForwardMove); 
                    }
                }
            }
            // Capture en diagonale à gauche
            const captureLeftMove = { x: selectedPiece.x - 1, y: selectedPiece.y + (selectedPiece.couleur === 'blanc' ? -1 : 1) };
            if (this.isCaptureValid(captureLeftMove)) {
                if(this.checkPiece){
                    if(this.check.some(mov => mov.x === captureLeftMove.x && mov.y === captureLeftMove.y)){
                        allowedMoves.push(captureLeftMove);
                    }
                }else{
                   allowedMoves.push(captureLeftMove); 
                }
            }
            // Capture en diagonale à droite
            const captureRightMove = { x: selectedPiece.x + 1, y: selectedPiece.y + (selectedPiece.couleur === 'blanc' ? -1 : 1) };
            if (this.isCaptureValid(captureRightMove)) {
                if(this.checkPiece){
                    if(this.check.some(mov => mov.x === captureRightMove.x && mov.y === captureRightMove.y)){
                        allowedMoves.push(captureRightMove);
                    }
                }else{
                   allowedMoves.push(captureRightMove); 
                }
            }
        }
        // Ajoutez des conditions spécifiques pour la tour
        if (selectedPiece && (selectedPiece.image.texture.key === 'BRook' || selectedPiece.image.texture.key === 'WRook'||selectedPiece.image.texture.key === 'BQueen' || selectedPiece.image.texture.key === 'WQueen')) {
            // Mouvement vertical vers le haut
            for (let i = selectedPiece.y - 1; i >= 0; i--) {
                const move = { x: selectedPiece.x, y: i };
                if (this.isMoveValid(move)|| this.isCaptureValid(move)) {
                    if(this.checkPiece){
                        if(this.check.some(mov => mov.x === move.x && mov.y === move.y)){
                            allowedMoves.push(move);
                        }
                    }else{
                       allowedMoves.push(move); 
                    }
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
                    if(this.checkPiece){
                        if(this.check.some(mov => mov.x === move.x && mov.y === move.y)){
                            allowedMoves.push(move);
                        }
                    }else{
                       allowedMoves.push(move); 
                    }
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
                    if(this.checkPiece){
                        if(this.check.some(mov => mov.x === move.x && mov.y === move.y)){
                            allowedMoves.push(move);
                        }
                    }else{
                       allowedMoves.push(move); 
                    }
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
                    if(this.checkPiece){
                        if(this.check.some(mov => mov.x === move.x && mov.y === move.y)){
                            allowedMoves.push(move);
                        }
                    }else{
                       allowedMoves.push(move); 
                    }
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
            const kingMoves = [
                [-1, -1], [-1, 0], [-1, 1],
                [0, -1],           [0, 1],
                [1, -1], [1, 0], [1, 1]
            ];
    
            kingMoves.forEach(offset => {
                const move = { x: selectedPiece.x + offset[0], y: selectedPiece.y + offset[1] };
    
                if (this.isMoveValid(move) || this.isCaptureValid(move)) {
                    allowedMoves.push(move);
                }
            });
    
            // Vérifier les mouvements du roi par rapport aux pièces adverses
            if (!selectedPiece.calculatingMoves) {
                this.selectedPiece.calculatingMoves = true; // Marquer la pièce comme en cours de calcul pour éviter la récursion infinie
                this.pieces.forEach(piece => {
                    if (piece.couleur !== selectedPiece.couleur) {
                        const opponentMoves = this.calculateAllowedMoves(piece);
                        opponentMoves.forEach(opponentMove => {
                            // Vérifier si le mouvement du roi coïncide avec un mouvement de pièce adverse
                            const kingMoveIndex = allowedMoves.findIndex(move =>
                                move.x === opponentMove.x && move.y === opponentMove.y
                            );
    
                            // Si le mouvement du roi coïncide avec un mouvement de pièce adverse, le supprimer
                            if (kingMoveIndex !== -1) {
                                allowedMoves.splice(kingMoveIndex, 1);
                            }
                        });
                    }
                });
                this.selectedPiece.calculatingMoves = false; // Réinitialiser le marquage de la pièce après le calcul des mouvements
            }
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
            if(this.checkPiece){
                if(this.check.some(mov => mov.x === move.x && mov.y === move.y)){
                    allowedMoves.push(move);
                }
            }else{
               allowedMoves.push(move); 
            }
            
    
            if (this.findPieceByCoordinates(move.x, move.y)) {
                break; // Sortir de la boucle si une pièce est rencontrée
            }
        }
    }

    addKnightMoves(allowedMoves, selectedPiece, offsetX, offsetY) {
        const move = { x: selectedPiece.x + offsetX, y: selectedPiece.y + offsetY };
    
        if (this.isMoveValid(move)||this.isCaptureValid(move)) {

            if(this.checkPiece){
                if(this.check.some(mov => mov.x === move.x && mov.y === move.y)){
                    allowedMoves.push(move);
                }
            }else{
               allowedMoves.push(move); 
            }
        }
    }

    addKingMoves(allowedMoves, selectedPiece, offsetX, offsetY) {
        const move = { x: selectedPiece.x + offsetX, y: selectedPiece.y + offsetY };
        
        if ((this.isMoveValid(move)||this.isCaptureValid(move) )) {
            allowedMoves.push(move);
        }
    }

    
    
    // isAllowedByCoordinates(x, y) {
    //     return this.allowedMovesForOpponent.find(move => move.x === x && move.y === y);
    // }  

    // getAllowedMovesForOpponent(pieces) {
    //     pieces
    //         .filter(piece => piece.couleur === (this.whiteTime ? 'noir' : 'blanc'))
    //         .forEach(piece => {
    //             // Exclure le roi adverse du calcul des mouvements autorisés
    //             if (piece.image.texture.key !== (this.whiteTime ? 'WKing' : 'BKing')) {
    //                 const allowed = this.calculateAllowedMoves(piece);
    //                 this.allowedMovesForOpponent.push(...allowed);
    //             }
    //         });
    
        
    // }

    // mettre cases du roi dans un tableau et vérifier piece par piece qu'elle ne peuvent pas aller dessus
    

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
