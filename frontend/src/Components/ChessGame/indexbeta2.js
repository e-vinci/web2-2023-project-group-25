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
        this.checkPiece2 = null;
        this.isdoublecheck = false;
        this.check = [];
        this.allowedMovesnow = [];
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
        const typeLayout = [
            ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook'],
            ['Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn'],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['', '', '', '', '', '', '', ''],
            ['Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn', 'Pawn'],
            ['Rook', 'Knight', 'Bishop', 'Queen', 'King', 'Bishop', 'Knight', 'Rook']
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
                                if(this.isdoublecheck && clickedPiece.type !== 'King'){
                                    console.log("double check le roi doit bouger");
                                }else{

                                    this.clickedCase = { x: j, y: i, image: case2 };
                                    this.selectedPiece = clickedPiece;
                                    case2.setTint(0xccd9ff);
                                    if(this.selectedPiece.type === 'King'){
                                        this.highlightAllowedMoves();
                                        
                                    }else if(this.doesRemovingPiecePutInCheck(clickedPiece)){
                                    
                                        this.highlightAllowedMoves();
                                    }
                                    
                                    console.log('Case sélectionnée 1:', j, i);
                                }
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
                            this.allowedMovesnow = [];

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
                const type = typeLayout[i][j];
                if( pieceName){
                    const couleur = (i < 3) ? 'noir' : 'blanc';
                    if(pieceName === 'BKing'){
                        const move = {x:j,y:i}
                        this.BKingPosition = move;
                        
                    }
                    if(pieceName === 'WKing'){
                        const move = {x:j,y:i}
                        this.WKingPosition = move;
                        
                    }

                    const pieceImage = this.add.image(caseX, caseY, pieceName).setDisplaySize(tailleCase, tailleCase);
                    this.pieces.push({ x: j, y: i, image: pieceImage, couleur,type });
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
        
        if (index !== -1 ) {
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

                // Récupérez la pièce existante
                const existingPiece = this.pieces[index];
    
                // Supprimez l'image de la pièce du plateau
                existingPiece.image.destroy();
    
                let updatedPiece;
                if ((existingPiece.image.texture.key === 'BPawn'&& newY === 7)|| (existingPiece.image.texture.key === 'WPawn'&& newY === 0)) {
                    console.log("letsgooo!!");
                    const newPieceKey = existingPiece.couleur === 'blanc' ? 'WQueen' : 'BQueen';
                    const newPieceImage = this.add.image(newX * tailleCase + 0.5151 * tailleCase, newY * tailleCase + 0.5151 * tailleCase, newPieceKey).setDisplaySize(tailleCase, tailleCase);
                    updatedPiece = { ...piece, x: newX, y: newY, image: newPieceImage };
                } else {
                    const newPieceImage = this.add.image(newX * tailleCase + 0.5151 * tailleCase, newY * tailleCase + 0.5151 * tailleCase, existingPiece.image.texture.key).setDisplaySize(tailleCase, tailleCase);
                    updatedPiece = { ...piece, x: newX, y: newY, image: newPieceImage };
                }
                // Mettez à jour la pièce dans le tableau pieces en utilisant splice
                this.pieces.splice(index, 1, updatedPiece);
                
                if(this.checkPiece){
                    // Bloquez les mouvements de la pièce bougée uniquement si elle protège le roi
                    this.checkPiece = null;
                    this.isCheck = false;
                }
                if(this.isdoublecheck){
                    this.isdoublecheck = false;
                }
                this.discoverCheck(this.pieces[index]);
                if(this.selectedPiece.type !== 'King'){
                    if(this.inCheck(updatedPiece) || this.checkPiece2){
                        if (this.inCheck(updatedPiece) && this.checkPiece2) {
                            // Traitez la situation du double check ici
                            console.log("Double check !");
                            this.isdoublecheck = true;
                            // ... Ajoutez le code pour gérer le double check ...
                        } 
                        if (this.checkPiece2) {
                            this.checkPiece = this.checkPiece2;
                            this.checkPiece2 = null;
                        } else {
                            this.checkPiece = this.pieces[index];
                        }
                        
                        
                        this.isCheck = true;
                        const kingP = this.whitetime ? this.BKingPosition : this.WKingPosition;
                        const King = this.findPieceByCoordinates(kingP.x,kingP.y);
                        const kingMoves = this.calculateAllowedMoves(King);
                        
                        console.log("kingp",kingP);
                        if (kingMoves.length === 0) {
                            // Aucun mouvement possible pour le roi, fin du jeu
                            if(this.isdoublecheck){
                                this.endGame(); 
                            }
                            this.isCheck = false;
                            let end = true;
                            this.pieces.forEach(objet => {
                                if (objet.couleur === King.couleur && objet.type !== 'King'&&this.doesRemovingPiecePutInCheck2(objet)) {
                                    
                                    this.isCheck = true;
                                    let allowedMovesForObjet = this.calculateAllowedMoves(objet);
                                    this.isCheck = false;
                                    
                                    // Si une pièce met en échec, filtrez les mouvements valides
                                                    
                                    allowedMovesForObjet = allowedMovesForObjet.filter(move => this.check.some(checkMove => checkMove.x === move.x && checkMove.y === move.y));
                                    
                                    const validMoves = allowedMovesForObjet.filter(move => {
                                        // Simulez chaque mouvement comme s'il y avait le type de la pièce qui met en échec
                                        const tempPiece = { ...this.checkPiece, x: move.x, y: move.y };
                                        
                                        // Vérifiez si la simulation conduit toujours à une situation d'échec
                                        return this.inCheck2(tempPiece);
                                    });
                                    
                                    allowedMovesForObjet = validMoves;
                                    
                                    if (allowedMovesForObjet.length > 0) {
                                        // Il y a des mouvements possibles pour cette pièce, ne rien faire
                                        end = false;
                                    }
                                    this.allowedMovesnow = [];
                                }
                            });
                        
                            if(end){
                               // Aucun mouvement possible pour toutes les pièces de la même couleur, fin du jeu
                            this.endGame(); 
                            }
                    
                            this.isCheck = true;
                        }
                        
                        
                        
                        console.log('Le roi est en échec !');
                        
                        
                    }
                }  
                
                if (this.selectedPiece.image.texture.key === 'BKing') {
                    this.BKingPosition = { x: newX, y: newY };
                } else if (this.selectedPiece.image.texture.key === 'WKing') {
                    this.WKingPosition = { x: newX, y: newY };
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
                this.allowedMovesnow = [];
                return true; // Déplacement réussi
            }
        }
    
        return false; // Déplacement échoué
    }

    discoverCheck(selectedPiece) {
        // Réinitialise la variable globale checkPiece2
        this.checkPiece2 = null;
        console.log("discovercheck");
        console.log("discover piece",selectedPiece);
        // Récupère la couleur de la pièce sélectionnée
        const selectedColor = selectedPiece.couleur;
    
        // Parcourt toutes les pièces de la même couleur
        this.pieces.forEach(piece => {
            if (piece.couleur === selectedColor && piece !== selectedPiece && piece.type !== 'King') {
                // Vérifie si la pièce est en échec
                console.log("objet",piece);
                if (this.inCheck(piece)) {
                    // Met à jour la variable globale checkPiece2
                    console.log("discovercheck TRUE");
                    this.checkPiece2 = piece;
                    console.log("diecoverp",this.checkPiece2);
                }
            }
        });
    }
    
    doesRemovingPiecePutInCheck(pieceToRemove) {
        // Sauvegardez temporairement l'état actuel
        const currentPieces = [...this.pieces];
        
    
        // Retirez temporairement la pièce
        const indexToRemove = this.pieces.findIndex(p => p === pieceToRemove);
        if (indexToRemove !== -1) {
            this.pieces.splice(indexToRemove, 1);
            if(this.checkPiece){
                const indexCheckPiece = this.pieces.findIndex(o => o === this.checkPiece);
                this.pieces.splice(indexCheckPiece,1);
            }
        }
        
        let resultat = true;
        
        const piecesWithout = this.pieces.filter(objet => 
            objet.image.texture.key !== 'BKing' &&
            objet.image.texture.key !== 'WKing' &&
            objet.couleur !== (this.whitetime ? 'blanc' : 'noir')
        );
        
        if(this.checkPiece){
            this.isCheck = false;
        }
        this.whitetime = !this.whitetime;
        const kingPosition = this.whitetime ? this.BKingPosition : this.WKingPosition;
       
        
        piecesWithout.forEach(objet => {
            if (this.inCheck2(objet)){
                // Si la fonction de vérification renvoie true pour au moins un objet,
                // alors considérez que c'est false et mettez à jour le résultat.
                
                const modifiedObjet = { ...objet };
                resultat = false;
                let isqueen = false;
                // Mettez à jour this.allowedMoves avec la position de l'objet
                
                const current = currentPieces[indexToRemove];
                if (current.type === 'Queen') {
                    isqueen = true;
                    if (current.x === kingPosition.x || current.y === kingPosition.y) {
                        current.type ='Rook';
                    } else {
                        current.type ='Bishop';
                        
                    }
                    
                } 
                
                this.whitetime = !this.whitetime;
                const allowedMoves = this.calculateAllowedMoves(current);
                
                const matchingMoves = allowedMoves.filter(move => move.x === modifiedObjet.x && move.y === modifiedObjet.y);
                let isqueen2 = false;
                if (modifiedObjet.type === 'Queen') {
                    isqueen2 = true;
                    if (modifiedObjet.x === kingPosition.x || modifiedObjet.y === kingPosition.y) {
                        modifiedObjet.type ='Rook';
                    } else {
                        modifiedObjet.type ='Bishop';
                        
                    }
                    
                } 
                
               if(((current.type === 'Rook')&&(modifiedObjet.type === 'Rook'))||((current.type === 'Bishop')&&(modifiedObjet.type === 'Bishop'))){
                const match = this.calculateAllowedMoves(modifiedObjet);
                const matchingMoves2 = allowedMoves.filter(move => match.some(caseInTableau => caseInTableau.x === move.x && caseInTableau.y === move.y));
                
                this.allowedMovesnow.push(...matchingMoves2);
               }
               if(isqueen2){
                modifiedObjet.type = 'Queen'
               }
                // Ajouter les moves correspondants à this.allowedMovesnow
                this.allowedMovesnow.push(...matchingMoves);
                // Mettre en surbrillance les cases dans l'interface utilisateur
                this.allowedMovesnow.forEach(move => {
                    const caseToUpdate = this.cases.find(c => c.x === move.x && c.y === move.y);
                    if (caseToUpdate) {
                        caseToUpdate.image.setTint(0x00FF00); // la couleur en vert
                    }
                });
                if(isqueen){
                    current.type = 'Queen';
                }
                this.whitetime = !this.whitetime;
            }
        });
        if(this.checkPiece){
            this.isCheck = true;
        }
        this.whitetime = !this.whitetime;
        // Rétablissez l'état d'origine
        this.pieces = currentPieces;
        
        // Le résultat final sera true si la fonction de vérification n'a jamais renvoyé true.
        console.log("resultat",resultat);
        return resultat;
    
    }

    doesRemovingPiecePutInCheck2(pieceToRemove) {
        // Sauvegardez temporairement l'état actuel
        
        const currentPieces = [...this.pieces];
        
        if(this.checkPiece){
            this.isCheck = true;
        }
        // Retirez temporairement la pièce
        const indexToRemove = this.pieces.findIndex(p => p === pieceToRemove);
        if (indexToRemove !== -1) {
            this.pieces.splice(indexToRemove, 1);
            if(this.checkPiece){
                const indexCheckPiece = this.pieces.findIndex(o => o === this.checkPiece);
                this.pieces.splice(indexCheckPiece,1);
            }
        }
        
        let resultat = true;
        
        const piecesWithout = this.pieces.filter(objet => 
            objet.image.texture.key !== 'BKing' &&
            objet.image.texture.key !== 'WKing' &&
            objet.couleur === (this.whitetime ? 'blanc' : 'noir')
        );
        
        
        this.whitetime = !this.whitetime;
       
        
        piecesWithout.forEach(objet => {
            if (this.inCheck3(objet)){
                // Si la fonction de vérification renvoie true pour au moins un objet,
                // alors considérez que c'est false et mettez à jour le résultat.
                
                resultat = false;
            }
        });
        if(this.checkPiece){
            this.isCheck = false;
        }
        this.whitetime = !this.whitetime;
        // Rétablissez l'état d'origine
        this.pieces = currentPieces;
        
        // Le résultat final sera true si la fonction de vérification n'a jamais renvoyé true.
        
        return resultat;
    
    }
    
    highlightAllowedMoves() {
        let allowedMoves
        let isqueen =false;
        if(this.isCheck){
            
            this.isCheck = false;
            const kingPosition = this.whitetime ? this.WKingPosition : this.BKingPosition;
            
            if (this.checkPiece.type === 'Queen'&& this.selectedPiece.type !== 'King') {
                isqueen = true;
                if (this.checkPiece.x === kingPosition.x || this.checkPiece.y === kingPosition.y) {
                    this.checkPiece.type ='Rook';
                } else {
                    this.checkPiece.type ='Bishop';
                    
                }
                this.check = this.calculateAllowedMoves(this.checkPiece);
                this.check.push({ x: this.checkPiece.x, y: this.checkPiece.y });
                
            } 
            
            
            allowedMoves = this.calculateAllowedMoves(this.selectedPiece);
            
            this.isCheck = true;
        }else{
            allowedMoves = this.calculateAllowedMoves(this.selectedPiece);
        }
        
        
        if (this.checkPiece && this.selectedPiece.type !== 'King') {
            // Si une pièce met en échec, filtrez les mouvements valides
                        
            allowedMoves = allowedMoves.filter(move => this.check.some(checkMove => checkMove.x === move.x && checkMove.y === move.y));
            
            const validMoves = allowedMoves.filter(move => {
                // Simulez chaque mouvement comme s'il y avait le type de la pièce qui met en échec
                const tempPiece = { ...this.checkPiece, x: move.x, y: move.y };
                
                // Vérifiez si la simulation conduit toujours à une situation d'échec
                return this.inCheck3(tempPiece);
            });
            
            if(isqueen){
                this.checkPiece.type = 'Queen';
            }
            
            allowedMoves = validMoves;
            
        }
        this.allowedMovesnow = allowedMoves;
        // Parcourez les cases autorisées et changez leur couleur
        this.allowedMovesnow.forEach(move => {
            const { x, y } = move;
            const caseToUpdate = this.cases.find(c => c.x === x && c.y === y);
    
            if (caseToUpdate) {
                caseToUpdate.image.setTint(0x00FF00); // la couleur en vert
            }
        });
        allowedMoves = null;
    }
    

    validate(x,y){
        
        if(this.allowedMovesnow.find(m => m.x ===x && m.y ===y))return true;
        return false;
    }

    inCheck(piece) {
        const kingPosition = this.whitetime ? this.BKingPosition : this.WKingPosition;
        
        // Seulement pour la pièce passée en paramètre
        const allowedMoves = this.calculateAllowedMoves(piece);
        
        if(allowedMoves.find(move => move.x === kingPosition.x && move.y === kingPosition.y)){
            this.check = allowedMoves;
            this.check.push({ x: piece.x, y: piece.y });
            return true;
        }

        return false;
    }

    inCheck2(piece) {
       
        const kingPosition = this.whitetime ? this.BKingPosition :this.WKingPosition ;
        console.log("inchek2kingPosition",kingPosition);
        // Seulement pour la pièce passée en paramètre
        
        const allowedMoves = this.calculateAllowedMoves(piece);
        
        console.log("incheck2allowed",allowedMoves);
        if(allowedMoves.find(move => move.x === kingPosition.x && move.y === kingPosition.y)){
            
            return true;
        }

        return false;
    }

    inCheck3(piece) {
        const kingPosition = this.whitetime ? this.WKingPosition :this.BKingPosition ;
        
        // Seulement pour la pièce passée en paramètre
        
        const allowedMoves = this.calculateAllowedMoves(piece);
       
        if(allowedMoves.find(move => move.x === kingPosition.x && move.y === kingPosition.y)){
            
            return true;
        }

        return false;
    }

    

    

    calculateAllowedMoves(selectedPiece) {
        const allowedMoves = [];
        
        // Ajoutez des conditions spécifiques pour le pion
        if (selectedPiece && (selectedPiece.type === 'Pawn' )) {
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
        if (selectedPiece && (selectedPiece.type === 'Rook' || selectedPiece.type === 'Queen')) {
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
        if (selectedPiece && (selectedPiece.type === 'Bishop' || selectedPiece.type === 'Queen')) {
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
        if (selectedPiece && (selectedPiece.type === 'Knight')) {
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

        if (selectedPiece && (selectedPiece.type === 'King')) {
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
            
                 // Marquer la pièce comme en cours de calcul pour éviter la récursion infinie
                const currentPieces = [...this.pieces];
                
                const index = this.pieces.findIndex(p => p === selectedPiece);
                
                if (index) {
                    
                    this.pieces.splice(index, 1);
                }
                
                
                this.pieces.forEach(piece => {
                    
                    if (piece.couleur !== selectedPiece.couleur && (piece.image.texture.key !== 'BKing'&&piece.image.texture.key !== 'WKing')) {
                        
                        const isPawn = (pawn) => pawn.image.texture.key === 'BPawn' || pawn.image.texture.key === 'WPawn';
                        
                        // Utilisation
                        const opponentMoves = isPawn(piece)
                            ? [
                                { x: piece.x - 1, y: piece.y + (piece.couleur === 'blanc' ? -1 : 1) },
                                { x: piece.x + 1, y: piece.y + (piece.couleur === 'blanc' ? -1 : 1) }
                            ]
                            : this.calculateAllowedMoves(piece);

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
                
            
                this.pieces = currentPieces;
                 // Réinitialiser le marquage de la pièce après le calcul des mouvements
            
            
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

    resetCaseColors() {
         // Réinitialisez la couleur de toutes les cases
         this.cases.forEach(caseData => {
             caseData.image.clearTint();
         });
    }
    
    endGame() {
        // Afficher un message de fin
        this.add.text(
            this.game.config.width / 2,
            this.game.config.height / 2,
            'Fin de la Partie!\nLe joueur 1 gagne!',
            { fontSize: '48px', fill: '#0c0',fontWeight: 'bold' }
        ).setOrigin(0.5);
    
        // Arrêter le jeu
        this.scene.pause(); // ou this.scene.stop();
    }
}

export default GameScene;
