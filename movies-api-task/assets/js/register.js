const registerForm = document.getElementById('registerForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const isValid = validateInputs(username, email, password, confirmPassword);

    if (isValid) {
        const registered = await registerUser(username, email, password);
        
        if (registered) {
            alert('Registration Successful!');
            window.location.href = 'login.html';
        } else {
            alert('Registration Failed. Please enter valid details.');
        }
    }
});

function validateInputs(username, email, password, confirmPassword) {
    const usernameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
    const confirmPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;

    if (password !== confirmPassword) {
        alert('Passwords do not match. Please enter matching passwords.');
        return false;
    }

    if (username.trim() === '') {
        alert('Username field cannot be empty');
        return false;
    }

    if (!usernameRegex.test(username)) {
        alert('Username should contain only letters');
        return false;
    }

    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    if (!passwordRegex.test(password)) {
        alert('Password must be at least 5 characters long, contain at least one letter, and at least one digit');
        return false;
    }

    return true;
}

async function registerUser(username, email, password) {
    return true;
}
