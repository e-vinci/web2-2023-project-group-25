import Navigate from '../Router/Navigate';


const History = async () => {
  // TODO: Demander au prof pourquoi .then ne fonctionne pas mais async/await oui
  const games = await fetch('http://localhost:3000/games').then((response) => {
    if (!response.ok) throw new Error(`fetch error : ${response.status} : ${response.statusText}`);
    return response.json();
  });
  // .then((games) => {
  //   renderHistory(games);
  // });

  renderHistory(games);

  attachOnClickEventToWatchButton();
  attachOnClickEventToDeleteButton();
};

// TODO: Changer 'pseudo du joueur connecté' ci-dessous
function renderHistory(games) {
  const formattedGames = games.map((game, index) => {
    const gameCopy = { ...game };
    gameCopy.num = index + 1;
    gameCopy.date = new Date(game.date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return gameCopy;
  });

  const history = `
  <div class="table-responsive">
    <table class='table table-hover'>
      <thead>
        <th class='col'><h6>#</h6></th>
        <th class='col'><h6>Date</h6></th>
        <th class='col'><h6>Result</h6></th>
        <th class='col'><h6>Opponent</h6></th>
        <th class='col'></th>
      </thead>
      <tbody>
      ${formattedGames
        .map(
          (game) => `
          <tr>
            <td>${game.num}</td>
            <td>${game.date}</td>
            ${
              game.winner === 'pseudo du joueur connecté'
                ? `<td><i class="bi bi-check-circle-fill"></i></td>`
                : `<td><i class="bi bi-x-circle-fill"></i></td>`
            }
            <td>${game.player2}</td>
            <td class="col text-end">
              <button type="button" value="${game.id}" class="watch-button btn btn-primary btn-sm">
                <i class="bi bi-eye-fill"></i>
              </button>
              <button type="button" class="delete-button btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <i class="bi bi-trash"></i>
              </button>
              <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="exampleModalLabel">Are you sure ?</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      This action cannot be undone !
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                      <button type="button" class="confirm-delete-button btn btn-danger">Delete game</button>
                    </div>
                  </div>
                </div>
              </div>
            </td>  
          </tr>
          `,
        )
        .join('\n')}
      </tbody>
    </table>
  </div>`;

  const historyWrapper = document.querySelector('#history-wrapper');
  historyWrapper.innerHTML = history;
}

function attachOnClickEventToWatchButton() {
  const watchButtons = document.querySelectorAll('.watch-button');
  watchButtons.forEach((button) => {
    button.addEventListener('click', () => {
      Navigate(`/gameDetails?id=${button.getAttribute('value')}`);
    });
  });
}

function attachOnClickEventToDeleteButton() {
  const deleteButton = document.querySelectorAll('.confirm-delete-button');
  deleteButton.forEach((button) => {
    button.addEventListener('click', () => {
      // fetch('DELETE', `http://localhost:3000/games/${button.getAttribute('value')}`); TODO: Check api call
      alert('Hello there !');
    });
  });
}

export default History;
