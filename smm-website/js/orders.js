// ===== ORDERS PAGE JAVASCRIPT =====

let allOrders = [];
let filteredOrders = [];
let currentFilter = 'all';
let currentSort = 'date-desc';
let searchQuery = '';

// Initialize page
window.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;
    
    loadUserInfo();
    loadOrders();
    setupEventListeners();
});

// Load user info
function loadUserInfo() {
    const user = userManager.getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.firstName;
        updateOrderStats();
    }
}

// Load all orders
function loadOrders() {
    const user = userManager.getCurrentUser();
    if (!user) return;
    
    allOrders = orderManager.getUserOrders(user.id);
    applyFiltersAndSort();
    displayOrders();
    updateOrderStats();
}

// Apply filters and sorting
function applyFiltersAndSort() {
    // Filter by status
    filteredOrders = allOrders.filter(order => {
        if (currentFilter === 'all') return true;
        return order.status === currentFilter;
    });
    
    // Filter by search query
    if (searchQuery) {
        filteredOrders = filteredOrders.filter(order => {
            return order.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   order.link.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   order.id.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }
    
    // Sort orders
    filteredOrders.sort((a, b) => {
        switch(currentSort) {
            case 'date-desc':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'date-asc':
                return new Date(a.createdAt) - new Date(b.createdAt);
            case 'price-desc':
                return b.price - a.price;
            case 'price-asc':
                return a.price - b.price;
            case 'status':
                return a.status.localeCompare(b.status);
            default:
                return 0;
        }
    });
}

// Display orders
function displayOrders() {
    const container = document.getElementById('ordersContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredOrders.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        
        if (searchQuery) {
            emptyState.innerHTML = `
                <i class="fas fa-search" style="font-size: 80px; color: var(--text-muted); margin-bottom: 20px;"></i>
                <h3>Hech narsa topilmadi</h3>
                <p>Qidiruv bo'yicha natija yo'q: "${searchQuery}"</p>
                <button class="btn btn-primary" onclick="clearSearch()">Tozalash</button>
            `;
        } else if (currentFilter !== 'all') {
            emptyState.innerHTML = `
                <i class="fas fa-filter" style="font-size: 80px; color: var(--text-muted); margin-bottom: 20px;"></i>
                <h3>Filter bo'yicha buyurtma yo'q</h3>
                <p>Ushbu statusda hech qanday buyurtma mavjud emas</p>
                <button class="btn btn-primary" onclick="setFilter('all')">Barchasini ko'rish</button>
            `;
        } else {
            emptyState.innerHTML = `
                <i class="fas fa-box-open" style="font-size: 80px; color: var(--text-muted); margin-bottom: 20px;"></i>
                <h3>Hali buyurtmalar yo'q</h3>
                <p>Birinchi buyurtmangizni yarating!</p>
                <a href="new-order.html" class="btn btn-primary">
                    <i class="fas fa-plus"></i> Yangi Buyurtma
                </a>
            `;
        }
        return;
    }
    
    container.style.display = 'block';
    emptyState.style.display = 'none';
    
    container.innerHTML = filteredOrders.map(order => `
        <div class="order-card" data-order-id="${order.id}">
            <div class="order-header">
                <div class="order-icon ${getServiceColor(order.category)}">
                    <i class="${getServiceIcon(order.category)}"></i>
                </div>
                <div class="order-main-info">
                    <h4>${order.service}</h4>
                    <p class="order-meta">
                        <span><i class="fas fa-hashtag"></i> ${order.id.substr(0, 8)}</span>
                        <span><i class="fas fa-clock"></i> ${formatDate(order.createdAt)}</span>
                    </p>
                </div>
                <div class="order-status-badge">
                    <span class="status-badge ${order.status}">
                        <i class="fas fa-${getStatusIcon(order.status)}"></i>
                        ${getStatusText(order.status)}
                    </span>
                </div>
            </div>
            
            <div class="order-body">
                <div class="order-details">
                    <div class="detail-item">
                        <span class="detail-label">Link:</span>
                        <span class="detail-value">${order.link}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Miqdor:</span>
                        <span class="detail-value">${formatNumber(order.quantity)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Narx:</span>
                        <span class="detail-value">${formatCurrency(order.price)}</span>
                    </div>
                </div>
                
                ${order.status === 'in-progress' ? `
                    <div class="order-progress">
                        <div class="progress-info">
                            <span>Jarayon: ${order.progress}%</span>
                            <span>${Math.floor(order.quantity * order.progress / 100)} / ${order.quantity}</span>
                        </div>
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: ${order.progress}%"></div>
                        </div>
                    </div>
                ` : ''}
                
                ${order.status === 'completed' ? `
                    <div class="order-completed">
                        <i class="fas fa-check-circle"></i>
                        <span>Bajarildi: ${formatDate(order.completedAt)}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="order-footer">
                <button class="btn btn-sm btn-outline" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> Batafsil
                </button>
                ${order.status === 'pending' || order.status === 'in-progress' ? `
                    <button class="btn btn-sm btn-outline" onclick="cancelOrder('${order.id}')" style="color: var(--danger-color); border-color: var(--danger-color);">
                        <i class="fas fa-times"></i> Bekor qilish
                    </button>
                ` : ''}
                ${order.status === 'completed' ? `
                    <button class="btn btn-sm btn-primary" onclick="reorder('${order.id}')">
                        <i class="fas fa-redo"></i> Qayta buyurtma
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Update order statistics
function updateOrderStats() {
    const stats = orderManager.getStatistics(userManager.getCurrentUser()?.id);
    
    document.getElementById('totalOrders').textContent = formatNumber(stats.total);
    document.getElementById('completedOrders').textContent = formatNumber(stats.completed);
    document.getElementById('pendingOrders').textContent = formatNumber(stats.inProgress + stats.pending);
    document.getElementById('cancelledOrders').textContent = formatNumber(stats.cancelled);
}

// Setup event listeners
function setupEventListeners() {
    // Search
    document.getElementById('searchOrders').addEventListener('input', function(e) {
        searchQuery = e.target.value;
        applyFiltersAndSort();
        displayOrders();
    });
    
    // Sort
    document.getElementById('sortOrders').addEventListener('change', function(e) {
        currentSort = e.target.value;
        applyFiltersAndSort();
        displayOrders();
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            setFilter(this.dataset.filter);
        });
    });
}

// Set filter
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    applyFiltersAndSort();
    displayOrders();
}

// Clear search
function clearSearch() {
    searchQuery = '';
    document.getElementById('searchOrders').value = '';
    applyFiltersAndSort();
    displayOrders();
}

// View order details
function viewOrderDetails(orderId) {
    const order = orderManager.getOrder(orderId);
    if (!order) return;
    
    alert(`Buyurtma Tafsilotlari:\n\nID: ${order.id}\nXizmat: ${order.service}\nMiqdor: ${order.quantity}\nLink: ${order.link}\nNarx: ${formatCurrency(order.price)}\nStatus: ${getStatusText(order.status)}\nYaratilgan: ${formatDate(order.createdAt)}`);
}

// Cancel order
function cancelOrder(orderId) {
    if (!confirm('Buyurtmani bekor qilmoqchimisiz?')) return;
    
    const result = orderManager.updateOrderStatus(orderId, 'cancelled', 0);
    
    if (result.success) {
        // Refund money
        const order = orderManager.getOrder(orderId);
        const user = userManager.getCurrentUser();
        userManager.updateUser(user.id, { balance: user.balance + order.price });
        
        loadOrders();
        showOrderAlert('Buyurtma bekor qilindi va pul qaytarildi', 'success');
    }
}

// Reorder
function reorder(orderId) {
    const order = orderManager.getOrder(orderId);
    if (!order) return;
    
    // Redirect to new order page with pre-filled data
    localStorage.setItem('reorder_data', JSON.stringify(order));
    window.location.href = 'new-order.html';
}

// Show alert
function showOrderAlert(message, type) {
    const alert = document.getElementById('orderAlert');
    alert.className = `alert ${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    alert.style.display = 'flex';
    
    setTimeout(() => {
        alert.style.display = 'none';
    }, 5000);
}

// Helper functions
function getServiceColor(category) {
    const colors = { telegram: 'blue', sms: 'green', instagram: 'purple', youtube: 'orange' };
    return colors[category] || 'blue';
}

function getServiceIcon(category) {
    const icons = { telegram: 'fab fa-telegram', sms: 'fas fa-sms', instagram: 'fab fa-instagram', youtube: 'fab fa-youtube' };
    return icons[category] || 'fas fa-box';
}

function getStatusIcon(status) {
    const icons = { pending: 'clock', 'in-progress': 'spinner', completed: 'check', cancelled: 'times' };
    return icons[status] || 'question';
}

function getStatusText(status) {
    const texts = { pending: 'Kutilmoqda', 'in-progress': 'Jarayonda', completed: 'Bajarildi', cancelled: 'Bekor qilindi' };
    return texts[status] || status;
}
