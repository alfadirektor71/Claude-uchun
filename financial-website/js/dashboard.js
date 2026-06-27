// Dashboard statistikalarini yuklash

let incomeExpenseChart = null;
let categoryChart = null;

function updateDashboard() {
    updateStats();
    updateCharts();
    updateRecentTransactions();
}

function updateStats() {
    // Bugungi daromad
    const todayIncome = Calculator.getTotalIncome('today');
    document.getElementById('todayIncome').textContent = formatCurrency(todayIncome);
    
    // Bugungi xarajat
    const todayExpense = Calculator.getTotalExpense('today');
    document.getElementById('todayExpense').textContent = formatCurrency(todayExpense);
    
    // Haftalik daromad
    const weeklyIncome = Calculator.getTotalIncome('week');
    document.getElementById('weeklyIncome').textContent = formatCurrency(weeklyIncome);
    
    // Oylik daromad
    const monthlyIncome = Calculator.getTotalIncome('month');
    document.getElementById('monthlyIncome').textContent = formatCurrency(monthlyIncome);
    
    // Umumiy balans
    const balance = Calculator.getBalance();
    document.getElementById('totalBalance').textContent = formatCurrency(balance);
    
    // Sof foyda
    const netProfit = Calculator.getNetProfit('month');
    document.getElementById('netProfit').textContent = formatCurrency(netProfit);
    
    // Jami mijozlar
    const customers = CustomerStorage.getAll();
    document.getElementById('totalCustomers').textContent = customers.length;
    
    // Kutilayotgan qarzlar
    const pendingDebts = Calculator.getPendingDebts();
    document.getElementById('pendingDebts').textContent = formatCurrency(pendingDebts);
}

function updateCharts() {
    updateIncomeExpenseChart();
    updateCategoryChart();
}


function updateIncomeExpenseChart() {
    const ctx = document.getElementById('incomeExpenseChart');
    if (!ctx) return;
    
    // Oxirgi 7 kunlik ma'lumotlar
    const labels = [];
    const incomeData = [];
    const expenseData = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(formatDate(date));
        
        const dayIncomes = IncomeStorage.getAll().filter(income => {
            return new Date(income.date).toDateString() === date.toDateString();
        });
        
        const dayExpenses = ExpenseStorage.getAll().filter(expense => {
            return new Date(expense.date).toDateString() === date.toDateString();
        });
        
        incomeData.push(dayIncomes.reduce((sum, i) => sum + parseFloat(i.amount), 0));
        expenseData.push(dayExpenses.reduce((sum, e) => sum + parseFloat(e.amount), 0));
    }
    
    if (incomeExpenseChart) {
        incomeExpenseChart.destroy();
    }
    
    incomeExpenseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daromad',
                data: incomeData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Xarajat',
                data: expenseData,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


function updateCategoryChart() {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    // Kategoriya bo'yicha xarajatlar
    const expenses = ExpenseStorage.getAll();
    const categoryData = {};
    
    expenses.forEach(expense => {
        const cat = expense.category || 'Boshqa';
        categoryData[cat] = (categoryData[cat] || 0) + parseFloat(expense.amount);
    });
    
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    const colors = [
        '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
        '#f59e0b', '#10b981', '#3b82f6', '#06b6d4'
    ];
    
    if (categoryChart) {
        categoryChart.destroy();
    }
    
    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'right',
                }
            }
        }
    });
}

function updateRecentTransactions() {
    const tbody = document.querySelector('#recentTransactions tbody');
    if (!tbody) return;
    
    // Barcha tranzaksiyalarni birlashtirish
    const incomes = IncomeStorage.getAll().map(i => ({...i, type: 'income'}));
    const expenses = ExpenseStorage.getAll().map(e => ({...e, type: 'expense'}));
    
    const transactions = [...incomes, ...expenses]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);
    
    tbody.innerHTML = '';
    
    transactions.forEach(transaction => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>
                <span class="badge badge-${transaction.type === 'income' ? 'success' : 'danger'}">
                    ${transaction.type === 'income' ? 'Daromad' : 'Xarajat'}
                </span>
            </td>
            <td>${transaction.category}</td>
            <td class="text-${transaction.type === 'income' ? 'success' : 'danger'}">
                ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
            </td>
            <td>${transaction.description || '-'}</td>
        `;
    });
}

function changeFilter(range) {
    // Filter tugmalarini yangilash
    document.querySelectorAll('.date-selector .btn-secondary').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    updateDashboard();
}

// Sahifa yuklanganda
document.addEventListener('DOMContentLoaded', () => {
    updateDashboard();
    
    // Har 30 sekundda yangilash
    setInterval(updateDashboard, 30000);
});
