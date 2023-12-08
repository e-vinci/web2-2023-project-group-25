// import Navigate from '../Router/Navigate';
import { clearPage } from '../../utils/render';

const RegisterPage = () => {
 
    clearPage();

    const registerPageContent =`
    <div class="container register-container">
        <h2 class="text-center mb-4">Register</h2>
        <form>
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" placeholder="Enter your username" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Enter your password" required>
            </div>
            <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <input type="password" class="form-control" id="confirmPassword" placeholder="Confirm your password" required>
            </div>
            <button type="submit" class="btn btn-primary w-100 custom-btn">Register</button>
        </form>
        <div class="mt-3 text-center">
            <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
    </div>
    `;




const main = document.querySelector('main');
main.innerHTML = registerPageContent;


  
};

export default RegisterPage;