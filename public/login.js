document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Form submitted'); // Debug log
        
        const email = document.getElementById('floatingEmail').value;
        const password = document.getElementById('floatingPassword').value;
        console.log('Attempting login with:', { email, password }); // Debug log
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();
            console.log('Login response:', result); // Debug log
            
            if (result.success) {
                localStorage.setItem('user', JSON.stringify(result.user));
                console.log('Redirecting to dashboard...'); // Debug log
                window.location.href = '/dashboard.html';
            } else {
                alert(result.message || 'Credenciales inválidas');
            }
        } catch (error) {
            console.error('Error en el login:', error);
            alert('Error al intentar iniciar sesión');
        }
    });
}); 