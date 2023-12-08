// import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';


const LoginPage = () => {
 
    clearPage();

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


  // History();
};

export default LoginPage;