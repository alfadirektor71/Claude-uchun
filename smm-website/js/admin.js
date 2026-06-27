// ===== ADMIN PANEL JAVASCRIPT =====

// Check if user is admin
window.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;
    
    const user = userManager.getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.firstName;
    }
    
    loadApiConfig();
    loadServices();
    updateApiStatus();
});

// Popular SMM Panel APIs
const providers = {
    justanotherpanel: {
        name: 'JustAnotherPanel',
        url: 'https://justanotherpanel.com/api/v2',
        docs: 'https://justanotherpanel.com/api'
    },
    smmking: {
        name: 'SMM King',
        url: 'https://smmking.com/api/v2',
        docs: 'https://smmking.com/api'
    },
    peakerr: {
        name: 'Peakerr',
        url: 'https://peakerr.com/api/v2',
        docs: 'https://peakerr.com/api-docs'
    },
    groominsta: {
        name: 'GroomInsta',
        url: 'https://groominsta.com/api/v2',
        docs: 'https://groominsta.com/api'
    }
};

// Update provider fields
function updateProviderFields() {
    const providerType = document.getElementById('providerType').value;
    const apiUrl = document.getElementById('apiUrl');
    
    if (providerType && providerType !== 'custom' && providers[providerType]) {
        apiUrl.value = providers[providerType].url;
    }
}

// Save API configuration
function saveApiConfig() {
    const config = {
        providerType: document.getElementById('providerType').value,
        apiUrl: document.getElementById('apiUrl').value,
        apiKey: document.getElementById('apiKey').value,
        globalMargin: parseFloat(document.getElementById('globalMargin').value),
        minOrderPrice: parseFloat(document.getElementById('minOrderPrice').value),
        currency: document.getElementById('currency').value,
        connectedAt: new Date().toISOString()
    };
    
    if (!config.apiUrl || !config.apiKey) {
        alert('❌ API URL va API Key kiritish majburiy!');
        return;
    }
    
    storage.set('apiConfig', config);
    alert('✅ API sozlamalari saqlandi!');
    updateApiStatus();
}

// Load API configuration
function loadApiConfig() {
    const config = storage.get('apiConfig');
    
    if (config) {
        document.getElementById('providerType').value = config.providerType || '';
        document.getElementById('apiUrl').value = config.apiUrl || '';
        document.getElementById('apiKey').value = config.apiKey || '';
        document.getElementById('globalMargin').value = config.globalMargin || 20;
        document.getElementById('minOrderPrice').value = config.minOrderPrice || 0.10;
        document.getElementById('currency').value = config.currency || 'USD';
    }
}

// Update API status
function updateApiStatus() {
    const config = storage.get('apiConfig');
    const statusBadge = document.getElementById('apiStatus');
    
    if (config && config.apiUrl && config.apiKey) {
        statusBadge.className = 'status-badge connected';
        statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> Ulangan';
    } else {
        statusBadge.className = 'status-badge disconnected';
        statusBadge.innerHTML = '<i class="fas fa-times-circle"></i> Ulanmagan';
    }
}

// Test API connection
async function testConnection() {
    const apiUrl = document.getElementById('apiUrl').value;
    const apiKey = document.getElementById('apiKey').value;
    const resultDiv = document.getElementById('connectionResult');
    
    if (!apiUrl || !apiKey) {
        alert('❌ API URL va API Key kiriting!');
        return;
    }
    
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = '<div style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin"></i> Tekshirilmoqda...</div>';
    
    // Simulate API test (in real scenario, this would be actual API call)
    // Since this is client-side demo, we'll simulate it
    setTimeout(() => {
        // In production, you would use:
        // const response = await fetch(apiUrl, { method: 'POST', body: JSON.stringify({ key: apiKey, action: 'balance' }) });
        
        const success = Math.random() > 0.5; // Simulate success/failure
        
        if (success) {
            resultDiv.innerHTML = `
                <div style="padding: 20px; background: rgba(16, 185, 129, 0.1); border-radius: 10px; border: 1px solid #10b981;">
                    <h4 style="color: #10b981; margin-bottom: 10px;"><i class="fas fa-check-circle"></i> Ulanish Muvaffaqiyatli!</h4>
                    <p style="color: var(--text-secondary);">Provider bilan bog'lanish o'rnatildi. Endi xizmatlarni import qilishingiz mumkin.</p>
                    <div style="margin-top: 15px; font-family: monospace; background: var(--dark-bg); padding: 15px; border-radius: 8px;">
                        <strong>Provider:</strong> ${document.getElementById('providerType').value || 'Custom'}<br>
                        <strong>URL:</strong> ${apiUrl}<br>
                        <strong>Status:</strong> <span style="color: #10b981;">Connected</span>
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div style="padding: 20px; background: rgba(239, 68, 68, 0.1); border-radius: 10px; border: 1px solid #ef4444;">
                    <h4 style="color: #ef4444; margin-bottom: 10px;"><i class="fas fa-times-circle"></i> Ulanish Xatosi!</h4>
                    <p style="color: var(--text-secondary);">API bilan bog'lanib bo'lmadi. API URL va Key to'g'riligini tekshiring.</p>
                    <div style="margin-top: 15px; font-family: monospace; background: var(--dark-bg); padding: 15px; border-radius: 8px; color: #ef4444;">
                        Error: Invalid API credentials or connection timeout
                    </div>
                </div>
            `;
        }
    }, 2000);
}

// Import services from API
function importServices() {
    const config = storage.get('apiConfig');
    
    if (!config || !config.apiUrl || !config.apiKey) {
        alert('❌ Avval API sozlamalarini kiriting va saqlang!');
        return;
    }
    
    if (!confirm('Xizmatlarni provider\'dan import qilmoqchimisiz? Bu jarayon bir necha daqiqa davom etishi mumkin.')) {
        return;
    }
    
    // In production, this would fetch from actual API
    // For demo, we'll create sample services
    const sampleServices = generateSampleServices();
    
    // Apply margin to prices
    const margin = config.globalMargin / 100;
    const processedServices = sampleServices.map(service => ({
        ...service,
        originalPrice: service.price,
        price: service.price * (1 + margin),
        margin: config.globalMargin,
        currency: config.currency
    }));
    
    storage.set('importedServices', processedServices);
    alert(`✅ ${processedServices.length} ta xizmat import qilindi!`);
    loadServices();
}

// Generate sample services (in production, this would come from API)
function generateSampleServices() {
    return [
        // Telegram
        { id: 1, category: 'telegram', name: 'Telegram O\'zbek Obunachilari [Real]', price: 0.05, min: 100, max: 10000, type: 'Default' },
        { id: 2, category: 'telegram', name: 'Telegram Jahon Obunachilari [HQ]', price: 0.03, min: 100, max: 50000, type: 'Default' },
        { id: 3, category: 'telegram', name: 'Telegram Post Ko\'rishlari', price: 0.001, min: 100, max: 1000000, type: 'Default' },
        { id: 4, category: 'telegram', name: 'Telegram Premium Obunachilari', price: 0.15, min: 50, max: 5000, type: 'Default' },
        { id: 5, category: 'telegram', name: 'Telegram Reaksiyalar [Mix]', price: 0.02, min: 10, max: 10000, type: 'Default' },
        { id: 6, category: 'telegram', name: 'Telegram Guruh A\'zolari [Aktiv]', price: 0.08, min: 50, max: 5000, type: 'Default' },
        
        // Instagram
        { id: 7, category: 'instagram', name: 'Instagram Obunachilari [HQ - Real]', price: 0.03, min: 100, max: 50000, type: 'Default' },
        { id: 8, category: 'instagram', name: 'Instagram Obunachilari [Super HQ]', price: 0.12, min: 100, max: 10000, type: 'Default' },
        { id: 9, category: 'instagram', name: 'Instagram Layklar [Instant]', price: 0.005, min: 100, max: 100000, type: 'Default' },
        { id: 10, category: 'instagram', name: 'Instagram Layklar [Real Users]', price: 0.015, min: 50, max: 10000, type: 'Default' },
        { id: 11, category: 'instagram', name: 'Instagram Ko\'rishlar [IGTV]', price: 0.001, min: 1000, max: 1000000, type: 'Default' },
        { id: 12, category: 'instagram', name: 'Instagram Ko\'rishlar [Reels]', price: 0.002, min: 1000, max: 500000, type: 'Default' },
        { id: 13, category: 'instagram', name: 'Instagram Story Ko\'rishlari', price: 0.003, min: 100, max: 50000, type: 'Default' },
        { id: 14, category: 'instagram', name: 'Instagram Izohlar [Custom]', price: 0.05, min: 10, max: 1000, type: 'Custom Comments' },
        { id: 15, category: 'instagram', name: 'Instagram Saqlashlar [Saves]', price: 0.02, min: 100, max: 10000, type: 'Default' },
        
        // YouTube
        { id: 16, category: 'youtube', name: 'YouTube Obunachilari [Real]', price: 0.5, min: 50, max: 5000, type: 'Default' },
        { id: 17, category: 'youtube', name: 'YouTube Ko\'rishlar [High Retention]', price: 0.01, min: 1000, max: 1000000, type: 'Default' },
        { id: 18, category: 'youtube', name: 'YouTube Layklar [Real Users]', price: 0.03, min: 100, max: 10000, type: 'Default' },
        { id: 19, category: 'youtube', name: 'YouTube Izohlar [Custom]', price: 0.08, min: 10, max: 1000, type: 'Custom Comments' },
        { id: 20, category: 'youtube', name: 'YouTube Watch Time [Hours]', price: 2.5, min: 100, max: 10000, type: 'Default' },
        
        // Facebook
        { id: 21, category: 'facebook', name: 'Facebook Sahifa Layklari [HQ]', price: 0.04, min: 100, max: 10000, type: 'Default' },
        { id: 22, category: 'facebook', name: 'Facebook Post Layklari', price: 0.01, min: 100, max: 50000, type: 'Default' },
        { id: 23, category: 'facebook', name: 'Facebook Do\'stlar/Obunachilari', price: 0.06, min: 100, max: 5000, type: 'Default' },
        { id: 24, category: 'facebook', name: 'Facebook Video Ko\'rishlari', price: 0.002, min: 1000, max: 500000, type: 'Default' },
        
        // Twitter/X
        { id: 25, category: 'twitter', name: 'Twitter Obunachilari [HQ]', price: 0.1, min: 100, max: 10000, type: 'Default' },
        { id: 26, category: 'twitter', name: 'Twitter Layklar [Real]', price: 0.02, min: 100, max: 10000, type: 'Default' },
        { id: 27, category: 'twitter', name: 'Twitter Retweet [Real]', price: 0.03, min: 50, max: 5000, type: 'Default' },
        
        // TikTok
        { id: 28, category: 'tiktok', name: 'TikTok Obunachilari [Real]', price: 0.08, min: 100, max: 10000, type: 'Default' },
        { id: 29, category: 'tiktok', name: 'TikTok Layklar [Fast]', price: 0.01, min: 100, max: 100000, type: 'Default' },
        { id: 30, category: 'tiktok', name: 'TikTok Ko\'rishlar [HQ]', price: 0.003, min: 1000, max: 1000000, type: 'Default' },
        
        // Spotify
        { id: 31, category: 'spotify', name: 'Spotify Premium Obunachilari', price: 0.15, min: 100, max: 10000, type: 'Default' },
        { id: 32, category: 'spotify', name: 'Spotify Track Streams', price: 0.005, min: 1000, max: 500000, type: 'Default' },
        
        // Other
        { id: 33, category: 'other', name: 'Website Traffic [Real Visitors]', price: 0.5, min: 1000, max: 100000, type: 'Default' },
        { id: 34, category: 'other', name: 'Discord Server Members', price: 0.2, min: 100, max: 5000, type: 'Default' },
        { id: 35, category: 'other', name: 'Twitch Channel Followers', price: 0.3, min: 100, max: 10000, type: 'Default' }
    ];
}

// Load and display services
function loadServices() {
    const services = storage.get('importedServices') || [];
    const servicesList = document.getElementById('servicesList');
    const serviceCount = document.getElementById('serviceCount');
    
    serviceCount.textContent = `${services.length} ta xizmat`;
    
    if (services.length === 0) {
        servicesList.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 30px;">Hozircha xizmatlar import qilinmagan. "Xizmatlarni Import Qilish" tugmasini bosing.</p>';
        return;
    }
    
    // Group by category
    const grouped = {};
    services.forEach(service => {
        if (!grouped[service.category]) {
            grouped[service.category] = [];
        }
        grouped[service.category].push(service);
    });
    
    servicesList.innerHTML = Object.keys(grouped).map(category => {
        const categoryServices = grouped[category];
        return `
            <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 10px; text-transform: capitalize;">
                    <i class="${getCategoryIcon(category)}"></i> ${category} 
                    <span style="color: var(--text-secondary); font-size: 14px;">(${categoryServices.length})</span>
                </h4>
                ${categoryServices.slice(0, 3).map(service => `
                    <div class="service-item">
                        <div class="service-info">
                            <h5 style="margin-bottom: 5px;">${service.name}</h5>
                            <p style="color: var(--text-secondary); font-size: 13px;">
                                Min: ${service.min} | Max: ${service.max} | 
                                Provider: $${service.originalPrice.toFixed(4)} | 
                                <strong style="color: var(--success);">Sizning narxingiz: $${service.price.toFixed(4)}</strong>
                            </p>
                        </div>
                        <div class="service-actions">
                            <button class="btn btn-sm btn-outline" onclick="editService(${service.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </div>
                `).join('')}
                ${categoryServices.length > 3 ? `<p style="text-align: center; color: var(--text-secondary); margin-top: 10px;">+${categoryServices.length - 3} ta ko'proq xizmat</p>` : ''}
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

// Apply pricing to all services
function applyPricing() {
    const config = storage.get('apiConfig');
    const services = storage.get('importedServices') || [];
    
    if (services.length === 0) {
        alert('❌ Avval xizmatlarni import qiling!');
        return;
    }
    
    const margin = parseFloat(document.getElementById('globalMargin').value) / 100;
    
    const updatedServices = services.map(service => ({
        ...service,
        price: service.originalPrice * (1 + margin),
        margin: margin * 100
    }));
    
    storage.set('importedServices', updatedServices);
    storage.set('apiConfig', { ...config, globalMargin: margin * 100 });
    
    alert('✅ Narxlar yangilandi!');
    loadServices();
}

// Edit service
function editService(serviceId) {
    const services = storage.get('importedServices') || [];
    const service = services.find(s => s.id === serviceId);
    
    if (!service) return;
    
    const newPrice = prompt(`Yangi narx kiriting (Provider narxi: $${service.originalPrice}):`, service.price);
    
    if (newPrice && !isNaN(newPrice)) {
        service.price = parseFloat(newPrice);
        service.margin = ((service.price - service.originalPrice) / service.originalPrice * 100).toFixed(2);
        storage.set('importedServices', services);
        alert('✅ Narx yangilandi!');
        loadServices();
    }
}

// Run API test
function runApiTest() {
    const config = storage.get('apiConfig');
    const endpoint = document.getElementById('testEndpoint').value;
    const testResult = document.getElementById('testResult');
    const testOutput = document.getElementById('testOutput');
    
    if (!config || !config.apiUrl || !config.apiKey) {
        alert('❌ Avval API sozlamalarini kiriting!');
        return;
    }
    
    testResult.style.display = 'block';
    testOutput.textContent = 'Testing...';
    
    // Simulate API call
    setTimeout(() => {
        let response;
        
        switch(endpoint) {
            case 'balance':
                response = {
                    status: 'success',
                    balance: 1250.50,
                    currency: 'USD'
                };
                break;
                
            case 'services':
                response = {
                    status: 'success',
                    services: [
                        { service: 1, name: 'Instagram Followers', rate: '0.03', min: '100', max: '50000' },
                        { service: 2, name: 'YouTube Views', rate: '0.01', min: '1000', max: '1000000' }
                    ]
                };
                break;
                
            case 'status':
                response = {
                    status: 'success',
                    order: '12345',
                    charge: '1.50',
                    start_count: '1000',
                    status: 'Completed',
                    remains: '0'
                };
                break;
        }
        
        testOutput.textContent = JSON.stringify(response, null, 2);
    }, 1500);
}
