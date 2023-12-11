const express = require('express');
const {
  readAllGames,
  readOneGame,
  createOneGame,
  deleteOneGame,
  updateOneGame,
} = require('../models/games');
const { authorize, isAdmin } = require('../utils/auths');

const router = express.Router();

/* Read all the games
   GET /games?order=date : ascending order by date
   GET /games?order=-date : descending order by date
*/
router.get('/', (res) => {
  const allGames = readAllGames();

  return res.json(allGames);
});

// Read the game identified by an id
router.get('/:id', (req, res) => {
  const foundGame = readOneGame(req.params.id);

  if (!foundGame) return res.sendStatus(404);

  return res.json(foundGame);
});

// Create a game
router.post('/', (req, res) => {
  const player1 = req?.body?.player1?.length !== 0 ? req.body.player1 : undefined;
  const player2 = req?.body?.player2?.length !== 0 ? req.body.player2 : undefined;
  const winner = req?.body?.winner?.length !== 0 ? req.body.winner : undefined;
  const moves = req?.body?.moves?.length !== 0 ? req.body.moves : undefined;

  if (!player1 || !player2 || !winner || !moves) return res.sendStatus(400);

  const createdGame = createOneGame(player1, player2, winner, moves);

  return res.json(createdGame);
});

// Delete a game based on id
router.delete('/:id', (req, res) => {
  const deletedGame = deleteOneGame(req.params.id);

  if (!deletedGame) return res.sendStatus(404);

  return res.json(deletedGame);
});

// Update a game based on its id and new values for its parameters
router.patch('/:id', authorize, isAdmin, (req, res) => {
  const player1 = req?.body?.player1;
  const player2 = req?.body?.player2;
  const winner = req?.body?.winner;
  const moves = req?.body?.moves;

  if (
    (!player1 && !player2 && !winner && !moves)
    || player1?.length === 0
    || player2?.length === 0
    || winner?.length === 0
    || moves?.length === 0
  ) {
    return res.sendStatus(400);
  }

  const updatedGame = updateOneGame(req.params.id, {
    player1,
    player2,
    winner,
    moves,
  });

  if (!updatedGame) return res.sendStatus(404);

  return res.json(updatedGame);
});

module.exports = router;
