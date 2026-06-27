// ===== NEW ORDER PAGE JAVASCRIPT =====

let currentCategory = 'telegram';
let selectedService = null;
let currentQuantity = 100;

// Initialize page
window.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;
    
    loadUserBalance();
    loadServices(currentCategory);
    loadPopularServices();
    setupEventListeners();
    updateSummary();
});

// Load user balance
function loadUserBalance() {
    const user = userManager.getCurrentUser();
    if (user) {
        document.getElementById('topBalanceAmount').textContent = formatCurrency(user.balance);
        document.getElementById('userName').textContent = user.firstName;
    }
}

// Load services by category
function loadServices(category) {
    const serviceSelect = document.getElementById('service');
    const services = servicesData[category] || [];
    
    serviceSelect.innerHTML = '<option value="">Xizmatni tanlang...</option>';
    
    services.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = `${service.name} - ${formatCurrency(service.price)}/dona`;
        option.dataset.service = JSON.stringify(service);
        serviceSelect.appendChild(option);
    });
    
    // Update link placeholder
    updateLinkPlaceholder(category);
}

// Update link placeholder based on category
function updateLinkPlaceholder(category) {
    const linkInput = document.getElementById('link');
    const linkLabel = document.getElementById('linkLabel');
    const linkHint = linkInput.nextElementSibling;
    
    const placeholders = {
        telegram: {
            label: 'Kanal/Guruh havolasi',
            placeholder: '@username yoki https://t.me/username',
            hint: 'Telegram: @username, Link: https://t.me/username'
        },
        sms: {
            label: 'Davlat',
            placeholder: 'Masalan: USA, UK, Russia',
            hint: 'Virtual raqam uchun davlatni kiriting'
        },
        instagram: {
            label: 'Instagram profil/post link',
            placeholder: 'https://instagram.com/username',
            hint: 'Instagram profil yoki post havolasini kiriting'
        },
        youtube: {
            label: 'YouTube video link',
            placeholder: 'https://youtube.com/watch?v=...',
            hint: 'YouTube video havolasini kiriting'
        }
    };
    
    const config = placeholders[category] || placeholders.telegram;
    linkLabel.textContent = config.label;
    linkInput.placeholder = config.placeholder;
    linkHint.textContent = config.hint;
}

// Setup event listeners
function setupEventListeners() {
    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentCategory = this.dataset.category;
            loadServices(currentCategory);
            updateSummary();
        });
    });
    
    // Service selection
    document.getElementById('service').addEventListener('change', function() {
        const option = this.options[this.selectedIndex];
        if (option.dataset.service) {
            selectedService = JSON.parse(option.dataset.service);
            document.getElementById('serviceDescription').textContent = selectedService.description;
            document.getElementById('quantityHint').textContent = 
                `Min: ${formatNumber(selectedService.minQuantity)} - Max: ${formatNumber(selectedService.maxQuantity)}`;
            
            // Update quantity limits
            const qtyInput = document.getElementById('quantity');
            qtyInput.min = selectedService.minQuantity;
            qtyInput.max = selectedService.maxQuantity;
            
            // Adjust current quantity if needed
            if (currentQuantity < selectedService.minQuantity) {
                currentQuantity = selectedService.minQuantity;
                qtyInput.value = currentQuantity;
            }
            
            updateSummary();
        }
    });
    
    // Quantity controls
    document.getElementById('decreaseQty').addEventListener('click', function() {
        const qtyInput = document.getElementById('quantity');
        const min = parseInt(qtyInput.min) || 1;
        currentQuantity = Math.max(min, currentQuantity - 100);
        qtyInput.value = currentQuantity;
        updateSummary();
    });
    
    document.getElementById('increaseQty').addEventListener('click', function() {
        const qtyInput = document.getElementById('quantity');
        const max = parseInt(qtyInput.max) || 999999;
        currentQuantity = Math.min(max, currentQuantity + 100);
        qtyInput.value = currentQuantity;
        updateSummary();
    });
    
    document.getElementById('quantity').addEventListener('input', function() {
        currentQuantity = parseInt(this.value) || 0;
        updateSummary();
    });
    
    // Form submission
    document.getElementById('newOrderForm').addEventListener('submit', handleOrderSubmit);
}

// Update order summary
function updateSummary() {
    if (!selectedService) {
        document.getElementById('summaryService').textContent = 'Tanlanmagan';
        document.getElementById('summaryQuantity').textContent = '0';
        document.getElementById('summaryUnitPrice').textContent = '$0.00';
        document.getElementById('summaryTotal').textContent = '$0.00';
        document.getElementById('summarySpeed').textContent = '-';
        document.getElementById('summaryQuality').textContent = '-';
        return;
    }
    
    const total = selectedService.price * currentQuantity;
    
    document.getElementById('summaryService').textContent = selectedService.name;
    document.getElementById('summaryQuantity').textContent = formatNumber(currentQuantity);
    document.getElementById('summaryUnitPrice').textContent = formatCurrency(selectedService.price);
    document.getElementById('summaryTotal').textContent = formatCurrency(total);
    document.getElementById('summarySpeed').textContent = selectedService.speed;
    document.getElementById('summaryQuality').textContent = selectedService.quality;
}

// Handle order submission
function handleOrderSubmit(e) {
    e.preventDefault();
    
    const link = document.getElementById('link').value;
    
    if (!selectedService) {
        showOrderAlert('Iltimos, xizmatni tanlang', 'error');
        return;
    }
    
    if (!link) {
        showOrderAlert('Iltimos, havolani kiriting', 'error');
        return;
    }
    
    const user = userManager.getCurrentUser();
    if (!user) {
        showOrderAlert('Xatolik: Foydalanuvchi topilmadi', 'error');
        return;
    }
    
    const total = selectedService.price * currentQuantity;
    
    // Check balance
    if (user.balance < total) {
        showOrderAlert(`Balans yetarli emas. Kerak: ${formatCurrency(total)}, Mavjud: ${formatCurrency(user.balance)}`, 'error');
        return;
    }
    
    // Create order
    const orderData = {
        service: selectedService.name,
        category: currentCategory,
        quantity: currentQuantity,
        link: link,
        price: total
    };
    
    const result = orderManager.createOrder(orderData);
    
    if (result.success) {
        showOrderAlert('Buyurtma muvaffaqiyatli yaratildi! Dashboard ga yo\'naltirilmoqda...', 'success');
        
        // Reload balance
        loadUserBalance();
        
        // Reset form
        setTimeout(() => {
            document.getElementById('newOrderForm').reset();
            selectedService = null;
            currentQuantity = 100;
            updateSummary();
            
            // Redirect to orders page
            window.location.href = 'orders.html';
        }, 2000);
    } else {
        showOrderAlert(result.message, 'error');
    }
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

// Load popular services
function loadPopularServices() {
    const container = document.getElementById('popularServices');
    const popular = [
        servicesData.telegram[0],
        servicesData.sms[0],
        servicesData.instagram[0],
        servicesData.youtube[0]
    ];
    
    container.innerHTML = popular.map(service => `
        <div class="service-item" onclick="selectPopularService('${service.id}', '${Object.keys(servicesData).find(cat => servicesData[cat].includes(service))}')">
            <div class="service-icon ${getServiceColor(Object.keys(servicesData).find(cat => servicesData[cat].includes(service)))}">
                <i class="${getServiceIcon(Object.keys(servicesData).find(cat => servicesData[cat].includes(service)))}"></i>
            </div>
            <div class="service-info">
                <h4>${service.name}</h4>
                <p>${service.description}</p>
            </div>
            <div class="service-action">
                <p class="service-price">${formatCurrency(service.price)}<span>/dona</span></p>
                <button class="btn-icon">
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Select popular service
function selectPopularService(serviceId, category) {
    // Set category
    document.querySelectorAll('.category-btn').forEach(btn => {
        if (btn.dataset.category === category) {
            btn.click();
        }
    });
    
    // Wait for services to load
    setTimeout(() => {
        const serviceSelect = document.getElementById('service');
        serviceSelect.value = serviceId;
        serviceSelect.dispatchEvent(new Event('change'));
        
        // Scroll to form
        document.getElementById('newOrderForm').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

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
