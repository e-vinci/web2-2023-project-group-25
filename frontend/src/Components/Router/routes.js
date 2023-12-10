import GameDetails from '../Pages/GameDetails';
import GamePage from '../Pages/GamePage';
import HomePage from '../Pages/HomePage';
import NewPage from '../Pages/NewPage';
import LoginPage from '../Pages/LoginPage';
import RegisterPage from '../Pages/RegisterPage';
import Logout from '../Logout/Logout';

const routes = {
  '/': HomePage,
  '/game': GamePage,
  '/new': NewPage,
  '/gameDetails': GameDetails,
  '/login': LoginPage,
  '/register':RegisterPage,
  '/logout':Logout,
};

export default routes;
