document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const logoutLink = document.getElementById('logoutLink');
    const navbarUsername = document.getElementById('navbarUsername');

    const passwordInput = document.getElementById('password');
    const showPasswordButton = document.getElementById('showPasswordButton');

    showPasswordButton.addEventListener('mousedown', () => {
        passwordInput.type = 'text';
    });

    showPasswordButton.addEventListener('mouseup', () => {
        passwordInput.type = 'password';
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const loggedInUser = await loginUser(email, password);

        if (loggedInUser) {
            setNavbarUsername(email);
            alert('Giriş edildi!'); 
            window.location.href = 'index.html';
        } else {
            alert('Giriş edilmedi.');
            window.location.href = 'login.html';
        }
        
   
    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        logoutUser();
    });
    

    const loginButton = document.getElementById('loginButton');

    if (loginButton) {
        loginButton.addEventListener('click', () => {
            if (!isLoggedIn()) {
                window.location.href = 'index.html';
            }
        });
    } else if (window.location.href== 'login.html') {
        console.error('Login button not found!');
    }
    
    async function loginUser(email, password,confirmpassword) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert('E-mailniz standartlara uygun deyil.');
            return false;
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{5,}$/;
        if (!passwordRegex.test(password)) {
            alert('Sifre en az 5 uzunluqda olmali,1boyuk herf,en az 1reqem olmalidir');
            return false;
        }
        if (isLoggedIn()) {
            alert('Hesabiniz var!');
            return false;
        }

        const response = await sendUsernameToAPI(email);
        if (response.ok) {
            return true;
        } else {
            return false;
        }
    }

    function logoutUser() {
        removeNavbarUsername();
        window.location.href = 'login.html';
    }
    function isLoggedIn() {
        if (navbarUsername) {
            return navbarUsername.textContent.trim() !== '';
        } else {
            console.error('Navbar username element not found!');
            return false;
        }
    }
    

    async function sendUsernameToAPI(username) {
        try {
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username }),
            });
            return response;
        } catch (error) {
            console.error('Error sending username to API:', error);
            return { ok: false };
        }
    }

    function setNavbarUsername(username) {
        navbarUsername.textContent = username;
        logoutLink.style.display = 'inline';
    }

    function removeNavbarUsername() {
        navbarUsername.textContent = '';
        logoutLink.style.display = 'none';
    }
});
})
