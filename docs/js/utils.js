// Yordamchi funksiyalar

// Pul formatini sozlash
function formatCurrency(amount) {
    return new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m';
}

// Sanani formatlash
function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}

// Sana oralig'ini tekshirish
function isDateInRange(date, range) {
    const d = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch(range) {
        case 'today':
            return d.toDateString() === today.toDateString();
        
        case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return d >= weekAgo && d <= today;
        
        case 'month':
            return d.getMonth() === today.getMonth() && 
                   d.getFullYear() === today.getFullYear();
        
        case 'year':
            return d.getFullYear() === today.getFullYear();
        
        default:
            return true;
    }
}

// Hisoblashlar
const Calculator = {
    // Umumiy daromad
    getTotalIncome(range = 'all') {
        const incomes = IncomeStorage.getAll();
        return incomes
            .filter(income => range === 'all' || isDateInRange(income.date, range))
            .reduce((sum, income) => sum + parseFloat(income.amount), 0);
    },


    // Umumiy xarajat
    getTotalExpense(range = 'all') {
        const expenses = ExpenseStorage.getAll();
        return expenses
            .filter(expense => range === 'all' || isDateInRange(expense.date, range))
            .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    },

    // Balans
    getBalance() {
        return this.getTotalIncome() - this.getTotalExpense();
    },

    // Sof foyda
    getNetProfit(range = 'all') {
        return this.getTotalIncome(range) - this.getTotalExpense(range);
    },

    // Foyda foizi
    getProfitPercentage(range = 'all') {
        const income = this.getTotalIncome(range);
        const profit = this.getNetProfit(range);
        return income > 0 ? ((profit / income) * 100).toFixed(2) : 0;
    },

    // Kutilayotgan qarzlar
    getPendingDebts() {
        const debts = DebtStorage.getAll();
        return debts
            .filter(debt => !debt.isPaid && debt.type === 'receive')
            .reduce((sum, debt) => sum + parseFloat(debt.amount), 0);
    },

    // To'lash kerak bo'lgan qarzlar
    getPayableDebts() {
        const debts = DebtStorage.getAll();
        return debts
            .filter(debt => !debt.isPaid && debt.type === 'pay')
            .reduce((sum, debt) => sum + parseFloat(debt.amount), 0);
    }
};

// Tema o'zgartirish
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}


// Temani yuklash
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Sidebar toggle (mobile)
function initSidebar() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
        
        // Tashqariga bosganda yopish
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            }
        });
    }
}

// Logout
function logout() {
    if (confirm('Tizimdan chiqmoqchimisiz?')) {
        // Hozircha faqat asosiy sahifaga qaytish
        window.location.href = 'login.html';
    }
}

// Sahifa yuklanganda
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    initSidebar();
});

// Global qidiruv
function initGlobalSearch() {
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            // Bu funksiya har bir sahifada alohida ishlanadi
            if (typeof performSearch === 'function') {
                performSearch(query);
            }
        });
    }
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
