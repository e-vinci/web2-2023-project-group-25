import { clearPage } from '../../utils/render';
import chessImage from '../../img/chessImage.jpg';


const HomePage = () => {
 
  clearPage();

  

  const homePageContent = `
    <div class="container text-center overflow-auto ">
      <div class="row pb-5">
        <div class="col">
          <h3 class="display-3">Bienvenue sur Chess Rumble !</h3>
          <p class="lead">Amusez-vous ;)</p>
        </div>
      </div>

      <div class="row pb-5">
        <div class="col">
          <div id="groot">
            <img class="chessImage" src="${chessImage}" alt="chessImage" />
          </div>
        </div>
      </div>

      <div class="row pb-5">
        <div class="col">
          <button id="playButton" class="btn btn-lg custom-btn">Play</button>
        </div>
      </div>

      <div class="row">
        <div class="col history-section">
          <h3>Historique des parties</h3>
          <p>Consultez vos parties.</p>
        </div>
      </div>
    </div>
  `;




const main = document.querySelector('main');
main.innerHTML = homePageContent;


};

export default HomePage;
