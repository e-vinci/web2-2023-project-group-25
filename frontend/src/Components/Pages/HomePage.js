import { clearPage } from '../../utils/render';
import History from '../History/History';

const HomePage = () => {
  clearPage();

  const main = document.querySelector('main');
  main.innerHTML = '<div id="history-wrapper"></div>';

  History();
};

export default HomePage;
