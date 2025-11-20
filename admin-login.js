// Admin Login JavaScript

// Admin credentials (in real app, this should be handled server-side)
const ADMIN_CREDENTIALS = {
    email: 'abdo.heem12@gmail.com',
    password: '1866'
};

// Initialize login page
document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
});

// Initialize Login Page
function initializeLogin() {
    try {
        // Initialize components
        initializeForm();
        initializePasswordToggle();
        initializeStats();
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loadingScreen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loadingScreen').style.display = 'none';
            }, 500);
        }, 1000);
        
        console.log('✅ Login page initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing login page:', error);
    }
}

// Initialize Form
function initializeForm() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await handleLogin();
    });
    
    // Check if admin is already logged in
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        redirectToDashboard();
    }
}

// Handle Login
async function handleLogin() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Show loading state
    showLoadingState(true);
    hideError();
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Validate credentials
        if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
            // Successful login
            
            // Store login state
            if (remember) {
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminEmail', email);
            } else {
                sessionStorage.setItem('adminLoggedIn', 'true');
                sessionStorage.setItem('adminEmail', email);
            }
            
            // Show success message
            showSuccess('تم تسجيل الدخول بنجاح!');
            
            // Redirect to dashboard
            setTimeout(() => {
                redirectToDashboard();
            }, 1500);
            
            console.log('✅ Admin login successful:', email);
        } else {
            // Failed login
            showError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
            console.log('❌ Admin login failed:', email);
        }
    } catch (error) {
        console.error('❌ Login error:', error);
        showError('حدث خطأ أثناء تسجيل الدخول. حاول مرة أخرى.');
    } finally {
        showLoadingState(false);
    }
}

// Initialize Password Toggle
function initializePasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const toggleIcon = toggleBtn.querySelector('i');
    
    toggleBtn.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        // Toggle icon
        if (type === 'password') {
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        } else {
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        }
    });
}

// Initialize Stats
async function initializeStats() {
    try {
        // Load data from API
        const [hotelsResponse, toursResponse, bookingsResponse, offersResponse] = await Promise.all([
            fetch('tables/hotels'),
            fetch('tables/tours'),
            fetch('tables/bookings'),
            fetch('tables/offers')
        ]);
        
        const hotelsData = await hotelsResponse.json();
        const toursData = await toursResponse.json();
        const bookingsData = await bookingsResponse.json();
        const offersData = await offersResponse.json();
        
        // Update stats
        document.getElementById('totalHotels').textContent = hotelsData.data.length;
        document.getElementById('totalTours').textContent = toursData.data.length;
        document.getElementById('totalBookings').textContent = bookingsData.data.length;
        document.getElementById('totalOffers').textContent = offersData.data.length;
        
        console.log('✅ Stats loaded successfully');
    } catch (error) {
        console.error('❌ Error loading stats:', error);
        // Set default values
        document.getElementById('totalHotels').textContent = '3';
        document.getElementById('totalTours').textContent = '2';
        document.getElementById('totalBookings').textContent = '5';
        document.getElementById('totalOffers').textContent = '1';
    }
}

// Show Loading State
function showLoadingState(loading) {
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    const submitBtn = document.querySelector('.btn-login');
    
    if (loading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
    } else {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
}

// Show Error
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    errorText.textContent = message;
    errorDiv.style.display = 'flex';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

// Hide Error
function hideError() {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.style.display = 'none';
}

// Show Success
function showSuccess(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        ">
            <i class="fas fa-check-circle"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Redirect to Dashboard
function redirectToDashboard() {
    window.location.href = 'dashboard.html';
}

// Add CSS for success notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Handle Forgot Password
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('forgot-password')) {
        e.preventDefault();
        alert('لإعادة تعيين كلمة المرور، يرجى التواصل مع الدعم الفني عبر واتساب: 01273426669');
    }
});

// Auto-fill demo credentials (for testing)
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        document.getElementById('email').value = ADMIN_CREDENTIALS.email;
        document.getElementById('password').value = ADMIN_CREDENTIALS.password;
        showSuccess('تم تعبئة بيانات التجربة تلقائياً');
    }
});