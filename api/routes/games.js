const express = require('express');
const {
  readAllGames,
  readOneGame,
  createOneGame,
  deleteOneGame,
  updateOneGame,
} = require('../models/games');

const router = express.Router();

/* Read all the games
 */
router.get('/', (req, res) => {
  const user = req?.query?.user;
  const allGames = readAllGames(user);

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
  const player = req?.body?.player?.length !== 0 ? req.body.player : undefined;
  const opponent = req?.body?.opponent?.length !== 0 ? req.body.opponent : undefined;
  const winner = req?.body?.winner?.length !== 0 ? req.body.winner : undefined;
  const moves = req?.body?.moves?.length !== 0 ? req.body.moves : undefined;

  if (!player || !opponent || !winner || !moves) return res.sendStatus(400);

  const createdGame = createOneGame(player, opponent, winner, moves);

  return res.json(createdGame);
});

// Delete a game based on id
router.delete('/:id', (req, res) => {
  const deletedGame = deleteOneGame(req.params.id);

  if (!deletedGame) return res.sendStatus(404);

  return res.json(deletedGame);
});

// Update a game based on its id and new values for its parameters
router.patch('/:id', (req, res) => {
  const player = req?.body?.player;
  const opponent = req?.body?.opponent;
  const winner = req?.body?.winner;
  const moves = req?.body?.moves;

  if (
    (!player && !opponent && !winner && !moves)
    || player?.length === 0
    || opponent?.length === 0
    || winner?.length === 0
    || moves?.length === 0
  ) {
    return res.sendStatus(400);
  }

  const updatedGame = updateOneGame(req.params.id, {
    player,
    opponent,
    winner,
    moves,
  });

  if (!updatedGame) return res.sendStatus(404);

  return res.json(updatedGame);
});

module.exports = router;
