// ===== DASHBOARD JAVASCRIPT =====

// Check authentication on load
window.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;
    
    loadDashboardData();
    initializeSidebar();
    loadRecentOrders();
    startOrderSimulation();
});

// Load dashboard data
function loadDashboardData() {
    const user = userManager.getCurrentUser();
    if (!user) return;
    
    // Update user info
    document.getElementById('userName').textContent = user.firstName;
    document.getElementById('userPlan').textContent = 'Bepul Foydalanuvchi';
    document.getElementById('welcomeName').textContent = user.firstName;
    
    // Get statistics
    const stats = orderManager.getStatistics(user.id);
    
    // Update stats
    document.getElementById('balanceAmount').textContent = formatCurrency(user.balance);
    document.getElementById('completedOrders').textContent = formatNumber(stats.completed);
    document.getElementById('pendingOrders').textContent = formatNumber(stats.inProgress + stats.pending);
    document.getElementById('totalSpent').textContent = formatCurrency(stats.totalSpent);
    
    // Animate numbers
    animateNumbers();
}

// Load recent orders
function loadRecentOrders() {
    const user = userManager.getCurrentUser();
    if (!user) return;
    
    const orders = orderManager.getUserOrders(user.id);
    const recentOrders = orders.slice(-4).reverse();
    
    const ordersContainer = document.getElementById('recentOrders');
    if (!ordersContainer || recentOrders.length === 0) return;
    
    ordersContainer.innerHTML = recentOrders.map(order => `
        <div class="order-item">
            <div class="order-icon ${getServiceColor(order.category)}">
                <i class="${getServiceIcon(order.category)}"></i>
            </div>
            <div class="order-info">
                <h4>${order.service}</h4>
                <p>${order.quantity} ${getServiceUnit(order.category)} • ${order.link}</p>
            </div>
            <div class="order-status">
                <span class="status-badge ${order.status}">
                    <i class="fas fa-${getStatusIcon(order.status)}"></i>
                    ${getStatusText(order.status)}
                </span>
                <p class="order-price">${formatCurrency(order.price)}</p>
            </div>
        </div>
    `).join('');
}

// Helper functions
function getServiceColor(category) {
    const colors = {
        telegram: 'blue',
        sms: 'green',
        instagram: 'purple',
        youtube: 'orange'
    };
    return colors[category] || 'blue';
}

function getServiceIcon(category) {
    const icons = {
        telegram: 'fab fa-telegram',
        sms: 'fas fa-sms',
        instagram: 'fab fa-instagram',
        youtube: 'fab fa-youtube'
    };
    return icons[category] || 'fas fa-box';
}

function getServiceUnit(category) {
    const units = {
        telegram: 'obunachi',
        sms: 'SMS',
        instagram: 'obunachi',
        youtube: 'ko\'rish'
    };
    return units[category] || 'dona';
}

function getStatusIcon(status) {
    const icons = {
        pending: 'clock',
        'in-progress': 'spinner',
        completed: 'check',
        cancelled: 'times'
    };
    return icons[status] || 'question';
}

function getStatusText(status) {
    const texts = {
        pending: 'Kutilmoqda',
        'in-progress': 'Jarayonda',
        completed: 'Bajarildi',
        cancelled: 'Bekor qilindi'
    };
    return texts[status] || status;
}

// Animate numbers
function animateNumbers() {
    const elements = document.querySelectorAll('.stat-number[data-count]');
    
    elements.forEach(element => {
        const target = parseInt(element.getAttribute('data-count'));
        let current = 0;
        const increment = target / 50;
        const duration = 1000;
        const stepTime = duration / 50;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(current));
            }
        }, stepTime);
    });
}

// Initialize sidebar
function initializeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileToggle = document.getElementById('mobileToggle');
    
    // Sidebar toggle for desktop
    sidebarToggle?.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });
    
    // Mobile toggle
    mobileToggle?.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

// Logout function
function logout() {
    if (confirm('Hisobingizdan chiqmoqchimisiz?')) {
        userManager.logout();
    }
}

// Toggle theme
function toggleTheme() {
    const body = document.body;
    const icon = document.querySelector('.theme-toggle i');
    
    body.classList.toggle('light-theme');
    
    if (body.classList.contains('light-theme')) {
        icon.className = 'fas fa-sun';
        storage.set('theme', 'light');
    } else {
        icon.className = 'fas fa-moon';
        storage.set('theme', 'dark');
    }
}

// Load theme preference
window.addEventListener('DOMContentLoaded', function() {
    const theme = storage.get('theme');
    const body = document.body;
    const icon = document.querySelector('.theme-toggle i');
    
    if (theme === 'light') {
        body.classList.add('light-theme');
        if (icon) icon.className = 'fas fa-sun';
    }
});

// Simulate order progress (for demo)
function startOrderSimulation() {
    const user = userManager.getCurrentUser();
    if (!user) return;
    
    const orders = orderManager.getUserOrders(user.id);
    const inProgressOrders = orders.filter(o => o.status === 'in-progress');
    
    if (inProgressOrders.length === 0) return;
    
    setInterval(() => {
        inProgressOrders.forEach(order => {
            if (order.progress < 100) {
                const newProgress = Math.min(order.progress + Math.random() * 5, 100);
                const newStatus = newProgress >= 100 ? 'completed' : 'in-progress';
                orderManager.updateOrderStatus(order.id, newStatus, newProgress);
                
                if (newProgress >= 100) {
                    loadDashboardData();
                    loadRecentOrders();
                }
            }
        });
    }, 10000); // Update every 10 seconds
}

// Search functionality
const searchInput = document.querySelector('.search-box input');
searchInput?.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    // Implement search logic here
    console.log('Searching for:', query);
});

// Notification button
document.querySelector('.notification-btn')?.addEventListener('click', function() {
    alert('Bildirishnomalar: Sizda 3 ta yangi bildirishnoma bor');
});

// Mark all notifications as read
document.querySelector('.mark-all-read')?.addEventListener('click', function() {
    document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
    });
    showAlert('Barcha bildirishnomalar o\'qilgan deb belgilandi', 'success');
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Observe all cards
document.querySelectorAll('.stat-card, .chart-card, .content-card, .info-card').forEach(card => {
    card.classList.add('scroll-animate');
    observer.observe(card);
});
