// import Navigate from '../Router/Navigate';
import { setAuthenticatedUser } from '../../utils/auths';
import Navbar from '../Navbar/Navbar';
import { clearPage } from '../../utils/render';


const LoginPage = () => {
    
    clearPage();
    
    //Creation of the login page 
    const loginPageContent =`
    <div class="container login-container">
        <h2 class="text-center mb-4">Login</h2>
            <form>
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" class="form-control" id="username" placeholder="Enter your username">
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" placeholder="Enter your password">
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="rememberMe">
                    <label class="form-check-label" for="rememberMe">Remember me</label>
                </div>
                <button type="submit" class="btn btn-primary w-100 custom-btn">Login</button>
            </form>
            <div class="mt-3 text-center">
                <p>Don't have an account? <a href="/register" data-uri="/register">Register here</a></p>
            </div>
    </div>
    `;

const main = document.querySelector('main');
main.innerHTML = loginPageContent;

const login = document.querySelector("form");
login.addEventListener('submit', onLogin);


//function qui va appeler l'api pour se connecter
async function onLogin(e) {
    e.preventDefault();
  
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;
  
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
  
    const response = await fetch('/api/auths/login', options);
  
    if (!response.ok) throw new Error(`fetch error : ${response.status} : ${response.statusText}`);
  
    const authenticatedUser = await response.json();
  
    setAuthenticatedUser(authenticatedUser);
  
    Navbar();
  
    Navigate('/');
  };
};

export default LoginPage;