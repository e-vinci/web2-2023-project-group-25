import GameDetailsPage from '../Pages/GameDetailsPage';
import GamePage from '../Pages/GamePage';
import HomePage from '../Pages/HomePage';
import NewPage from '../Pages/NewPage';
import LoginPage from '../Pages/LoginPage';
import RegisterPage from '../Pages/RegisterPage';
import Logout from '../Logout/Logout';
import ChessPage from '../Pages/Chess';

const routes = {
  '/': HomePage,
  '/game': GamePage,
  '/new': NewPage,
  '/gameDetails': GameDetailsPage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/logout': Logout,
  '/chess': ChessPage,

};

export default routes;
