document.addEventListener('DOMContentLoaded', () => {
    const tabLogin = document.getElementById('tabLogin');
    const tabRegister = document.getElementById('tabRegister');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Toggle Tabs
    tabLogin.addEventListener('click', () => {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabLogin.classList.add('bg-gray-700', 'text-white');
        tabLogin.classList.remove('text-gray-400');
        tabRegister.classList.remove('bg-gray-700', 'text-white');
        tabRegister.classList.add('text-gray-400');
    });

    tabRegister.addEventListener('click', () => {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        tabRegister.classList.add('bg-gray-700', 'text-white');
        tabRegister.classList.remove('text-gray-400');
        tabLogin.classList.remove('bg-gray-700', 'text-white');
        tabLogin.classList.add('text-gray-400');
    });

    // Handle Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = document.getElementById('loginUser').value;
        const pass = document.getElementById('loginPass').value;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: user, password: pass })
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem('tourUser', JSON.stringify(data.user));
                
                // Redirect based on role
                if (data.user.role === 'Admin') {
                    window.location.href = 'dashboard-admin.html';
                } else {
                    window.location.href = 'dashboard-user.html';
                }
            } else {
                alert('Login failed: ' + data.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Server error. Is the backend running?');
        }
    });

    // Handle Register
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const user = document.getElementById('regUser').value;
        const pass = document.getElementById('regPass').value;

        try {
            const response = await fetch('http://localhost:3000/api/participants', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre: name, correo: email, username: user, password: pass, idRol: 1 })
            });
            
            if (response.ok) {
                alert('Registration successful! Please login.');
                tabLogin.click(); // Switch to login tab
            } else {
                alert('Registration failed.');
            }
        } catch (error) {
            console.error('Register error:', error);
        }
    });
});
