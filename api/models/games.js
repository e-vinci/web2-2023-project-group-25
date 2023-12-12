const path = require('node:path');
const escape = require('escape-html');
const { parse, serialize } = require('../utils/json');

const jsonDbPath = path.join(__dirname, '/../data/games.json');

const defaultGames = [];

function readAllGames(user) {
  let games = parse(jsonDbPath, defaultGames);
  if (user) {
    games = games.filter((game) => game.player === user);
  }

  return games;
}

function readOneGame(id) {
  const idNumber = parseInt(id, 10);
  const games = parse(jsonDbPath, defaultGames);
  const indexOfGameFound = games.findIndex((game) => game.id === idNumber);
  if (indexOfGameFound < 0) return undefined;

  return games[indexOfGameFound];
}

function createOneGame(player1, player2, winner, moves) {
  const games = parse(jsonDbPath, defaultGames);

  const createdGame = {
    id: getNextId(),
    date: Date.now(),
    player1: escape(player1),
    player2: escape(player2),
    winner: escape(winner),
    moves: escape(moves),
  };

  games.push(createdGame);

  serialize(jsonDbPath, games);

  return createdGame;
}

function getNextId() {
  const games = parse(jsonDbPath, defaultGames);
  const lastItemIndex = games?.length !== 0 ? games.length - 1 : undefined;
  if (lastItemIndex === undefined) return 1;
  const lastId = games[lastItemIndex]?.id;
  const nextId = lastId + 1;
  return nextId;
}

function deleteOneGame(id) {
  const idNumber = parseInt(id, 10);
  const games = parse(jsonDbPath, defaultGames);
  const foundIndex = games.findIndex((game) => game.id === idNumber);
  if (foundIndex < 0) return undefined;
  const deletedGames = games.splice(foundIndex, 1);
  const deletedGame = deletedGames[0];
  serialize(jsonDbPath, games);

  return deletedGame;
}

function updateOneGame(id, propertiesToUpdate) {
  const idNumber = parseInt(id, 10);
  const games = parse(jsonDbPath, defaultGames);
  const foundIndex = games.findIndex((game) => game.id === idNumber);
  if (foundIndex < 0) return undefined;

  const updatedGame = { ...games[foundIndex], ...propertiesToUpdate };

  games[foundIndex] = updatedGame;

  serialize(jsonDbPath, games);

  return updatedGame;
}

module.exports = {
  readAllGames,
  readOneGame,
  createOneGame,
  deleteOneGame,
  updateOneGame,
};
