import { setAuthenticatedUser } from '../../utils/auths';
import Navbar from '../Navbar/Navbar';
import Navigate from '../Router/Navigate';
/* eslint-disable */
import anime from 'animejs/lib/anime.es.js';

const RegisterPage = () => {

    const registerPageContent =`
        <div class="container register-container">
            <h2 class="text-center mb-4 text-white"> Inscription</h2>
            <form id="registrationForm" action="/register" method="post">
                <div class="mb-3">
                    <label for="username" class="form-label custom-form-label ">Pseudo</label>
                    <input type="text" class="form-control" id="username" placeholder="Entrez votre Pseudo" required>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label custom-form-label">Mot de passe</label>
                    <input type="password" class="form-control" id="password" placeholder="Entrez votre mot de passe" required>
                </div>
                <div class="mb-3">
                    <label for="confirmPassword" class="form-label custom-form-label">Confirm Password</label>
                    <input type="password" class="form-control" id="confirmPassword" placeholder="Confirmez votre mot de passe" required>
                    <div id="passwordError" class="text-danger" ></div>
                </div>
                <button type="submit" class="btn btn-primary  custom-btn" id="registerButton">S'inscrire</button>
            </form>
            <div class="mt-3 text-center">
                <p class="fs-4">Vous avez déjà un compte ? <a href="/login">Se connecter</a></p>
            </div>
        </div>`;
    

const main = document.querySelector('main');
main.innerHTML = registerPageContent;

const registerButton = document.getElementById('registerButton');
// animation register page
registerButton.addEventListener('mouseover', () => {
  anime({
    targets: registerButton,
    width: '+=150px', 
    easing: 'linear',
    duration: 300,
  });
});

registerButton.addEventListener('mouseout', () => {
  anime({
    targets: registerButton,
    width: '-=150px', 
    easing: 'linear',
    duration: 300,
  });
});

const register = document.querySelector("form");
register.addEventListener('submit', onRegister);


async function onRegister(e) {
    e.preventDefault();
  
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#confirmPassword').value;

    if (password !== confirmPassword) {
      const passwordError = document.querySelector('#passwordError');
      passwordError.textContent = 'Password does not match.';
      return; 
    }

    const passwordError = document.querySelector('#passwordError');
    passwordError.textContent = '';
  
    const options = {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  
    const response = await fetch('https://chessrumble.azurewebsites.net/auths/register', options);
  
    if (!response.ok){
      if(response.status === 409){
        const passwordError = document.querySelector('#passwordError');
        passwordError.textContent = 'Le username existe déjà!';
        return;
      }

      if(response.status === 400){
        
        const errorResponse = await response.json();

        const formattedErrors = errorResponse.errors.join('\n');

        console.log('Détails de l\'erreur :', formattedErrors);

        const passwordError = document.querySelector('#passwordError');
        passwordError.textContent = formattedErrors;
        return;
      }
    }

    passwordError.textContent = '';
  
    const authenticatedUser = await response.json();
  
    console.log('Newly registered & authenticated user : ', authenticatedUser);
  
    setAuthenticatedUser(authenticatedUser);
  
    Navbar();
  
    Navigate('/');
};
};

export default RegisterPage;