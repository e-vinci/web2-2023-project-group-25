// eslint-disable-next-line no-unused-vars
import chessLogo from '../../img/ChessRumbleLogo.png';
import { getAuthenticatedUser, isAuthenticated } from '../../utils/auths';



const Navbar = () => {

  const authenticatedUser = getAuthenticatedUser();
  
  const anonymousUserNavbar = `
    <nav class="navbar navbar-expand-lg navbar-light custom-navbar">
          <div class="container-fluid">
          <a class="navbar-brand" href="#" data-uri="/">
          <img src="${chessLogo}" alt="Chess Rumble" class="brand-image" width="50" height="50">
          </a>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link" aria-current="page" href="#" data-uri="/">Home</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#" data-uri="/game">Game</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#" data-uri="/new">New Page</a>
                </li>                                               
              </ul>
              <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link" href="#" data-uri="/login">Log in</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
    `;

  const authenticatedUserNavbar = `
    <nav class="navbar navbar-expand-lg navbar-light custom-navbar">
          <div class="container-fluid">
          <a class="navbar-brand" href="#" data-uri="/">
          <img src="${chessLogo}" alt="Chess Rumble" class="brand-image" width="50" height="50">
          </a>
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link" aria-current="page" href="#" data-uri="/">Home</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#" data-uri="/game">Game</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#" data-uri="/new">New Page</a>
                </li>                                               
              </ul>
              <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item">
                  <a class="nav-link disabled" href="#">Hello , ${authenticatedUser?.username}</a>
                </li> 
                <li class="nav-item">
                  <a class="nav-link" href="#" data-uri="/logout">Logout</a>
                </li>    
              </ul>
            </div>
          </div>
        </nav>
    `;

  const navbar = document.querySelector('#navbarWrapper');

  navbar.innerHTML = isAuthenticated() ? authenticatedUserNavbar : anonymousUserNavbar;
};

export default Navbar;
