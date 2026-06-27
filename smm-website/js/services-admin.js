// ===== SERVICES ADMIN JAVASCRIPT =====

let allServices = [];
let currentEditingService = null;

window.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;
    
    const user = userManager.getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.firstName;
    }
    
    loadAllServices();
    updateStatistics();
});

// Load all services
function loadAllServices() {
    allServices = storage.get('importedServices') || [];
    displayServices(allServices);
}

// Display services
function displayServices(services) {
    const servicesList = document.getElementById('servicesList');
    
    if (services.length === 0) {
        servicesList.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--text-secondary);">
                <i class="fas fa-box-open" style="font-size: 60px; margin-bottom: 20px; opacity: 0.3;"></i>
                <h3>Xizmatlar topilmadi</h3>
                <p style="margin-top: 10px;">Avval API sozlamalar sahifasidan xizmatlarni import qiling.</p>
                <a href="admin.html" class="btn btn-primary" style="margin-top: 20px; display: inline-block;">
                    <i class="fas fa-cog"></i> API Sozlamalari
                </a>
            </div>
        `;
        return;
    }
    
    servicesList.innerHTML = services.map(service => {
        const profitPercent = service.margin || ((service.price - service.originalPrice) / service.originalPrice * 100).toFixed(1);
        const profitAmount = (service.price - service.originalPrice).toFixed(4);
        
        return `
            <div class="service-card">
                <div class="service-details">
                    <h4><i class="${getCategoryIcon(service.category)}"></i> ${service.name}</h4>
                    <div class="service-meta">
                        <span><i class="fas fa-layer-group"></i> Min: ${service.min}</span>
                        <span><i class="fas fa-layer-group"></i> Max: ${service.max}</span>
                        <span><i class="fas fa-truck"></i> Provider: $${service.originalPrice.toFixed(4)}</span>
                        <span class="profit-badge"><i class="fas fa-chart-line"></i> +${profitPercent}% ($${profitAmount})</span>
                    </div>
                </div>
                <div class="service-actions">
                    <div class="price-badge">$${service.price.toFixed(4)}</div>
                    <button class="btn btn-sm btn-outline" onclick="editServiceModal(${service.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteService(${service.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function getCategoryIcon(category) {
    const icons = {
        telegram: 'fab fa-telegram',
        instagram: 'fab fa-instagram',
        youtube: 'fab fa-youtube',
        facebook: 'fab fa-facebook',
        twitter: 'fab fa-twitter',
        tiktok: 'fab fa-tiktok',
        spotify: 'fab fa-spotify',
        other: 'fas fa-globe'
    };
    return icons[category] || 'fas fa-box';
}

// Filter services
function filterServices() {
    const category = document.getElementById('filterCategory').value;
    const search = document.getElementById('searchService').value.toLowerCase();
    const sortBy = document.getElementById('sortBy').value;
    
    let filtered = [...allServices];
    
    // Filter by category
    if (category) {
        filtered = filtered.filter(s => s.category === category);
    }
    
    // Search
    if (search) {
        filtered = filtered.filter(s => s.name.toLowerCase().includes(search));
    }
    
    // Sort
    switch(sortBy) {
        case 'name':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'margin-desc':
            filtered.sort((a, b) => {
                const marginA = ((a.price - a.originalPrice) / a.originalPrice * 100);
                const marginB = ((b.price - b.originalPrice) / b.originalPrice * 100);
                return marginB - marginA;
            });
            break;
    }
    
    displayServices(filtered);
}

// Update statistics
function updateStatistics() {
    const services = storage.get('importedServices') || [];
    
    document.getElementById('totalServices').textContent = services.length;
    document.getElementById('activeServices').textContent = services.length;
    
    if (services.length > 0) {
        const avgMargin = services.reduce((sum, s) => {
            return sum + ((s.price - s.originalPrice) / s.originalPrice * 100);
        }, 0) / services.length;
        
        const totalProfit = services.reduce((sum, s) => {
            return sum + (s.price - s.originalPrice);
        }, 0);
        
        document.getElementById('avgMargin').textContent = avgMargin.toFixed(1) + '%';
        document.getElementById('potentialProfit').textContent = '$' + totalProfit.toFixed(2);
    }
}

// Show add service modal
function showAddServiceModal() {
    alert('Yangi xizmat qo\'shish uchun API Provider\'dan import qiling yoki mavjud xizmatni tahrirlang.');
}

// Edit service modal
function editServiceModal(serviceId) {
    const service = allServices.find(s => s.id === serviceId);
    if (!service) return;
    
    currentEditingService = service;
    
    document.getElementById('editServiceId').value = service.id;
    document.getElementById('editServiceName').value = service.name;
    document.getElementById('editOriginalPrice').value = service.originalPrice.toFixed(4);
    document.getElementById('editPrice').value = service.price.toFixed(4);
    document.getElementById('editMin').value = service.min;
    document.getElementById('editMax').value = service.max;
    document.getElementById('editCategory').value = service.category;
    
    calculateMargin();
    
    document.getElementById('editModal').classList.add('active');
}

// Calculate margin from price
function calculateMargin() {
    const originalPrice = parseFloat(document.getElementById('editOriginalPrice').value);
    const price = parseFloat(document.getElementById('editPrice').value);
    
    if (originalPrice && price) {
        const margin = ((price - originalPrice) / originalPrice * 100).toFixed(2);
        document.getElementById('editMargin').value = margin;
    }
}

// Calculate price from margin
function calculatePriceFromMargin() {
    const originalPrice = parseFloat(document.getElementById('editOriginalPrice').value);
    const margin = parseFloat(document.getElementById('editMargin').value);
    
    if (originalPrice && margin) {
        const price = originalPrice * (1 + margin / 100);
        document.getElementById('editPrice').value = price.toFixed(4);
    }
}

// Save service
function saveService() {
    const serviceId = parseInt(document.getElementById('editServiceId').value);
    const services = storage.get('importedServices') || [];
    const serviceIndex = services.findIndex(s => s.id === serviceId);
    
    if (serviceIndex === -1) return;
    
    services[serviceIndex] = {
        ...services[serviceIndex],
        name: document.getElementById('editServiceName').value,
        price: parseFloat(document.getElementById('editPrice').value),
        min: parseInt(document.getElementById('editMin').value),
        max: parseInt(document.getElementById('editMax').value),
        category: document.getElementById('editCategory').value,
        margin: parseFloat(document.getElementById('editMargin').value)
    };
    
    storage.set('importedServices', services);
    
    alert('✅ Xizmat yangilandi!');
    closeModal();
    loadAllServices();
    updateStatistics();
}

// Delete service
function deleteService(serviceId) {
    if (!confirm('Bu xizmatni o\'chirmoqchimisiz?')) return;
    
    const services = storage.get('importedServices') || [];
    const filtered = services.filter(s => s.id !== serviceId);
    
    storage.set('importedServices', filtered);
    
    alert('✅ Xizmat o\'chirildi!');
    loadAllServices();
    updateStatistics();
}

// Close modal
function closeModal() {
    document.getElementById('editModal').classList.remove('active');
}

// Close modal on outside click
document.getElementById('editModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});
