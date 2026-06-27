// ===== AUTH PAGES JAVASCRIPT =====

// Toggle password visibility
function togglePassword(inputId = 'password') {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling?.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        if (button) button.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        if (button) button.className = 'fas fa-eye';
    }
}

// Check password strength
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return strength;
}

// Update password strength indicator
function updatePasswordStrength() {
    const password = document.getElementById('password').value;
    const strengthBar = document.querySelector('.strength-bar');
    
    if (!strengthBar) return;
    
    const strength = checkPasswordStrength(password);
    
    strengthBar.className = 'strength-bar';
    
    if (strength < 3) {
        strengthBar.classList.add('weak');
    } else if (strength < 5) {
        strengthBar.classList.add('medium');
    } else {
        strengthBar.classList.add('strong');
    }
}

// Login form handler
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember')?.checked || false;
    
    // Validate
    if (!email || !password) {
        showAlert('Iltimos, barcha maydonlarni to\'ldiring', 'error');
        return;
    }
    
    // Make sure demo data exists
    const users = storage.get('users') || [];
    console.log('Existing users:', users);
    
    // If no users, create demo user
    if (users.length === 0) {
        const demoUser = {
            id: 'demo-user-1',
            firstName: 'Demo',
            lastName: 'User',
            email: 'demo@seensms.uz',
            phone: '+998901234567',
            password: 'demo123',
            plan: 'basic',
            balance: 100.00,
            createdAt: new Date().toISOString(),
            verified: true
        };
        users.push(demoUser);
        storage.set('users', users);
        console.log('Demo user created');
    }
    
    // Try to login
    const result = userManager.login(email, password, remember);
    
    console.log('Login result:', result);
    
    if (result.success) {
        showAlert(result.message, 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showAlert(result.message, 'error');
    }
});

// Register form handler
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    const newsletter = document.getElementById('newsletter').checked;
    
    // Validate
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showAlert('Iltimos, barcha maydonlarni to\'ldiring', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Parollar mos kelmaydi', 'error');
        return;
    }
    
    if (password.length < 8) {
        showAlert('Parol kamida 8 ta belgidan iborat bo\'lishi kerak', 'error');
        return;
    }
    
    if (!terms) {
        showAlert('Iltimos, foydalanish shartlarini qabul qiling', 'error');
        return;
    }
    
    // Try to register with default basic plan
    const result = userManager.register({
        firstName,
        lastName,
        email,
        phone,
        password,
        plan: 'basic' // Default bepul plan
    });
    
    if (result.success) {
        showAlert(result.message, 'success');
        
        // Auto login
        userManager.login(email, password, true);
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showAlert(result.message, 'error');
    }
});

// Password strength indicator for register page
document.getElementById('password')?.addEventListener('input', updatePasswordStrength);

// Social login handlers - simplified auto login
document.querySelectorAll('.btn-social').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const provider = this.classList.contains('btn-google') ? 'Google' : 'Telegram';
        
        // Create a quick social user
        const randomId = Date.now();
        const socialUser = {
            id: 'social-' + randomId,
            firstName: provider,
            lastName: 'User',
            email: `${provider.toLowerCase()}user${randomId}@seensms.uz`,
            phone: '+998900000000',
            password: 'social-login-' + randomId,
            plan: 'basic',
            balance: 50.00,
            createdAt: new Date().toISOString(),
            verified: true,
            provider: provider
        };
        
        // Add to users
        const users = storage.get('users') || [];
        users.push(socialUser);
        storage.set('users', users);
        
        // Auto login
        userManager.currentUser = socialUser;
        storage.set('currentUser', socialUser);
        
        showAlert(`${provider} orqali muvaffaqiyatli kirdingiz!`, 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    });
});

// Load URL parameters for plan selection
window.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    
    if (plan && document.getElementById('plan')) {
        document.getElementById('plan').value = plan;
    }
});
