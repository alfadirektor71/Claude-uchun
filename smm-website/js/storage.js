// ===== LOCAL STORAGE MANAGEMENT =====

class StorageManager {
    constructor() {
        this.prefix = 'seensms_';
    }

    // Get item from localStorage
    get(key) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error getting item from storage:', error);
            return null;
        }
    }

    // Set item in localStorage
    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error setting item in storage:', error);
            return false;
        }
    }

    // Remove item from localStorage
    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('Error removing item from storage:', error);
            return false;
        }
    }

    // Clear all items
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }
}

// Initialize storage manager
const storage = new StorageManager();

// ===== USER MANAGEMENT =====

class UserManager {
    constructor() {
        this.currentUser = null;
        this.loadCurrentUser();
    }

    // Register new user
    register(userData) {
        try {
            // Check if user already exists
            const users = storage.get('users') || [];
            const existingUser = users.find(u => u.email === userData.email);
            
            if (existingUser) {
                return { success: false, message: 'Bu email allaqachon ro\'yxatdan o\'tgan' };
            }

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phone: userData.phone,
                password: userData.password, // In production, this should be hashed
                plan: userData.plan || 'basic',
                balance: 50.00, // Boshlang'ich bonus
                createdAt: new Date().toISOString(),
                verified: true // Avtomatik tasdiqlangan
            };

            users.push(newUser);
            storage.set('users', users);

            return { success: true, message: 'Ro\'yxatdan o\'tish muvaffaqiyatli!', user: newUser };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'Xatolik yuz berdi' };
        }
    }

    // Login user
    login(email, password, remember = false) {
        try {
            const users = storage.get('users') || [];
            console.log('Login attempt:', email, 'Available users:', users.length);
            
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                console.log('User not found or password incorrect');
                return { success: false, message: 'Email yoki parol noto\'g\'ri' };
            }

            console.log('User found:', user.email);

            // Set current user
            this.currentUser = user;
            storage.set('currentUser', user);

            if (remember) {
                storage.set('rememberMe', true);
            }

            return { success: true, message: 'Xush kelibsiz!', user: user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Xatolik yuz berdi' };
        }
    }

    // Logout user
    logout() {
        this.currentUser = null;
        storage.remove('currentUser');
        storage.remove('rememberMe');
        window.location.href = 'index.html';
    }

    // Load current user
    loadCurrentUser() {
        this.currentUser = storage.get('currentUser');
        return this.currentUser;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Update user
    updateUser(userId, updates) {
        try {
            const users = storage.get('users') || [];
            const userIndex = users.findIndex(u => u.id === userId);

            if (userIndex === -1) {
                return { success: false, message: 'Foydalanuvchi topilmadi' };
            }

            users[userIndex] = { ...users[userIndex], ...updates };
            storage.set('users', users);

            // Update current user if it's the same
            if (this.currentUser && this.currentUser.id === userId) {
                this.currentUser = users[userIndex];
                storage.set('currentUser', this.currentUser);
            }

            return { success: true, message: 'Ma\'lumotlar yangilandi', user: users[userIndex] };
        } catch (error) {
            console.error('Update user error:', error);
            return { success: false, message: 'Xatolik yuz berdi' };
        }
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }
}

// Initialize user manager
const userManager = new UserManager();

// ===== ORDER MANAGEMENT =====

class OrderManager {
    constructor() {
        this.orders = storage.get('orders') || [];
    }

    // Create new order
    createOrder(orderData) {
        try {
            const newOrder = {
                id: Date.now().toString(),
                userId: userManager.getCurrentUser()?.id,
                service: orderData.service,
                category: orderData.category,
                quantity: orderData.quantity,
                link: orderData.link,
                price: orderData.price,
                status: 'pending', // pending, in-progress, completed, cancelled
                progress: 0,
                createdAt: new Date().toISOString(),
                completedAt: null
            };

            this.orders.push(newOrder);
            this.saveOrders();

            // Deduct balance
            const user = userManager.getCurrentUser();
            if (user) {
                const newBalance = user.balance - orderData.price;
                userManager.updateUser(user.id, { balance: newBalance });
            }

            return { success: true, message: 'Buyurtma yaratildi!', order: newOrder };
        } catch (error) {
            console.error('Create order error:', error);
            return { success: false, message: 'Xatolik yuz berdi' };
        }
    }

    // Get user orders
    getUserOrders(userId) {
        return this.orders.filter(o => o.userId === userId);
    }

    // Get order by ID
    getOrder(orderId) {
        return this.orders.find(o => o.id === orderId);
    }

    // Update order status
    updateOrderStatus(orderId, status, progress = null) {
        try {
            const orderIndex = this.orders.findIndex(o => o.id === orderId);
            
            if (orderIndex === -1) {
                return { success: false, message: 'Buyurtma topilmadi' };
            }

            this.orders[orderIndex].status = status;
            if (progress !== null) {
                this.orders[orderIndex].progress = progress;
            }
            if (status === 'completed') {
                this.orders[orderIndex].completedAt = new Date().toISOString();
                this.orders[orderIndex].progress = 100;
            }

            this.saveOrders();

            return { success: true, message: 'Buyurtma yangilandi', order: this.orders[orderIndex] };
        } catch (error) {
            console.error('Update order error:', error);
            return { success: false, message: 'Xatolik yuz berdi' };
        }
    }

    // Save orders to storage
    saveOrders() {
        storage.set('orders', this.orders);
    }

    // Get orders statistics
    getStatistics(userId) {
        const userOrders = this.getUserOrders(userId);
        return {
            total: userOrders.length,
            completed: userOrders.filter(o => o.status === 'completed').length,
            inProgress: userOrders.filter(o => o.status === 'in-progress').length,
            pending: userOrders.filter(o => o.status === 'pending').length,
            cancelled: userOrders.filter(o => o.status === 'cancelled').length,
            totalSpent: userOrders.reduce((sum, o) => sum + o.price, 0)
        };
    }
}

// Initialize order manager
const orderManager = new OrderManager();

// ===== TRANSACTION MANAGEMENT =====

class TransactionManager {
    constructor() {
        this.transactions = storage.get('transactions') || [];
    }

    // Add transaction
    addTransaction(transactionData) {
        try {
            const newTransaction = {
                id: Date.now().toString(),
                userId: userManager.getCurrentUser()?.id,
                type: transactionData.type, // deposit, withdrawal, order, refund
                amount: transactionData.amount,
                method: transactionData.method,
                description: transactionData.description,
                status: transactionData.status || 'completed',
                createdAt: new Date().toISOString()
            };

            this.transactions.push(newTransaction);
            this.saveTransactions();

            // Update user balance if deposit or refund
            if (transactionData.type === 'deposit' || transactionData.type === 'refund') {
                const user = userManager.getCurrentUser();
                if (user) {
                    const newBalance = user.balance + transactionData.amount;
                    userManager.updateUser(user.id, { balance: newBalance });
                }
            }

            return { success: true, message: 'Tranzaksiya yaratildi!', transaction: newTransaction };
        } catch (error) {
            console.error('Add transaction error:', error);
            return { success: false, message: 'Xatolik yuz berdi' };
        }
    }

    // Get user transactions
    getUserTransactions(userId) {
        return this.transactions.filter(t => t.userId === userId);
    }

    // Save transactions to storage
    saveTransactions() {
        storage.set('transactions', this.transactions);
    }
}

// Initialize transaction manager
const transactionManager = new TransactionManager();

// ===== SERVICES DATA =====

const servicesData = {
    telegram: [
        {
            id: 'tg-members-1',
            name: 'Telegram Members (Real)',
            description: 'Real obunachiler - uzun muddatli',
            price: 0.02,
            minQuantity: 100,
            maxQuantity: 50000,
            speed: '1000-2000/kun',
            quality: 'HQ'
        },
        {
            id: 'tg-members-2',
            name: 'Telegram Members (Fast)',
            description: 'Tez qo\'shish - instant',
            price: 0.01,
            minQuantity: 100,
            maxQuantity: 100000,
            speed: '5000-10000/kun',
            quality: 'MQ'
        },
        {
            id: 'tg-views',
            name: 'Telegram Post Views',
            description: 'Post ko\'rishlarini oshirish',
            price: 0.003,
            minQuantity: 500,
            maxQuantity: 1000000,
            speed: '10000-20000/kun',
            quality: 'HQ'
        },
        {
            id: 'tg-reactions',
            name: 'Telegram Reactions',
            description: 'Emoji reaksiyalar',
            price: 0.005,
            minQuantity: 100,
            maxQuantity: 50000,
            speed: '1000-5000/kun',
            quality: 'HQ'
        }
    ],
    sms: [
        {
            id: 'sms-usa',
            name: 'SMS Verification - USA',
            description: 'Virtual raqam - Amerika',
            price: 0.50,
            minQuantity: 1,
            maxQuantity: 100,
            speed: 'Instant',
            quality: 'Premium'
        },
        {
            id: 'sms-uk',
            name: 'SMS Verification - UK',
            description: 'Virtual raqam - Britaniya',
            price: 0.45,
            minQuantity: 1,
            maxQuantity: 100,
            speed: 'Instant',
            quality: 'Premium'
        },
        {
            id: 'sms-russia',
            name: 'SMS Verification - Russia',
            description: 'Virtual raqam - Rossiya',
            price: 0.30,
            minQuantity: 1,
            maxQuantity: 100,
            speed: 'Instant',
            quality: 'HQ'
        }
    ],
    instagram: [
        {
            id: 'ig-followers',
            name: 'Instagram Followers',
            description: 'Real obunachiler - HQ',
            price: 0.01,
            minQuantity: 100,
            maxQuantity: 50000,
            speed: '1000-2000/kun',
            quality: 'HQ'
        },
        {
            id: 'ig-likes',
            name: 'Instagram Likes',
            description: 'Post layklari',
            price: 0.008,
            minQuantity: 50,
            maxQuantity: 100000,
            speed: '5000-10000/kun',
            quality: 'HQ'
        },
        {
            id: 'ig-views',
            name: 'Instagram Video Views',
            description: 'Video ko\'rishlar',
            price: 0.005,
            minQuantity: 500,
            maxQuantity: 1000000,
            speed: '10000-50000/kun',
            quality: 'HQ'
        }
    ],
    youtube: [
        {
            id: 'yt-views',
            name: 'YouTube Views',
            description: 'Real ko\'rishlar',
            price: 0.005,
            minQuantity: 1000,
            maxQuantity: 1000000,
            speed: '5000-10000/kun',
            quality: 'HQ'
        },
        {
            id: 'yt-likes',
            name: 'YouTube Likes',
            description: 'Video layklari',
            price: 0.02,
            minQuantity: 50,
            maxQuantity: 10000,
            speed: '500-1000/kun',
            quality: 'HQ'
        },
        {
            id: 'yt-subscribers',
            name: 'YouTube Subscribers',
            description: 'Kanal obunachilari',
            price: 0.03,
            minQuantity: 100,
            maxQuantity: 50000,
            speed: '500-1000/kun',
            quality: 'HQ'
        }
    ]
};

// ===== UTILITY FUNCTIONS =====

// Format currency
function formatCurrency(amount) {
    return '$' + amount.toFixed(2);
}

// Format number
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return 'Hozir';
    if (minutes < 60) return minutes + ' daqiqa oldin';
    if (hours < 24) return hours + ' soat oldin';
    if (days < 30) return days + ' kun oldin';
    
    return date.toLocaleDateString('uz-UZ');
}

// Show alert message
function showAlert(message, type = 'success') {
    const alertDiv = document.getElementById('alertMessage');
    if (!alertDiv) return;
    
    alertDiv.className = `alert ${type}`;
    alertDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    alertDiv.style.display = 'flex';
    
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 5000);
}

// Check authentication
function checkAuth() {
    if (!userManager.isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize demo data
function initializeDemoData() {
    // Check if already initialized
    const existingUsers = storage.get('users');
    if (existingUsers && existingUsers.length > 0) return;
    
    // Create demo user
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
    
    storage.set('users', [demoUser]);
    
    // Create demo orders
    const demoOrders = [
        {
            id: 'order-1',
            userId: 'demo-user-1',
            service: 'Telegram Members (Real)',
            category: 'telegram',
            quantity: 1000,
            link: '@demochannel',
            price: 20.00,
            status: 'in-progress',
            progress: 65,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            completedAt: null
        },
        {
            id: 'order-2',
            userId: 'demo-user-1',
            service: 'SMS Verification - USA',
            category: 'sms',
            quantity: 10,
            link: 'Virtual number',
            price: 5.00,
            status: 'completed',
            progress: 100,
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            completedAt: new Date(Date.now() - 3600000).toISOString()
        }
    ];
    
    storage.set('orders', demoOrders);
    
    // Create demo transactions
    const demoTransactions = [
        {
            id: 'tx-1',
            userId: 'demo-user-1',
            type: 'deposit',
            amount: 100.00,
            method: 'Card',
            description: 'Hisobni to\'ldirish',
            status: 'completed',
            createdAt: new Date(Date.now() - 86400000).toISOString()
        }
    ];
    
    storage.set('transactions', demoTransactions);
    
    console.log('Demo data initialized');
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    // Initialize immediately
    initializeDemoData();
    
    // Also initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDemoData);
    }
}


