function loadSettings() {
    updateStats();
}

function updateStats() {
    document.getElementById('totalIncomes').textContent = IncomeStorage.getAll().length;
    document.getElementById('totalExpenses').textContent = ExpenseStorage.getAll().length;
    document.getElementById('totalCustomers').textContent = CustomerStorage.getAll().length;
    document.getElementById('totalDebts').textContent = DebtStorage.getAll().length;
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    showToast('Tema o\'zgartirildi!', 'success');
}

function backupData() {
    const data = {
        incomes: IncomeStorage.getAll(),
        expenses: ExpenseStorage.getAll(),
        customers: CustomerStorage.getAll(),
        debts: DebtStorage.getAll(),
        categories: CategoryStorage.getAll(),
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Ma\'lumotlar yuklandi!', 'success');
}

function restoreData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.incomes) Storage.save('incomes', data.incomes);
            if (data.expenses) Storage.save('expenses', data.expenses);
            if (data.customers) Storage.save('customers', data.customers);
            if (data.debts) Storage.save('debts', data.debts);
            if (data.categories) Storage.save('categories', data.categories);
            
            showToast('Ma\'lumotlar tiklandi!', 'success');
            setTimeout(() => location.reload(), 1000);
        } catch (error) {
            showToast('Xato! Fayl formati noto\'g\'ri!', 'error');
        }
    };
    reader.readAsText(file);
}

function clearAllData() {
    if (confirm('DIQQAT! Barcha ma\'lumotlar o\'chiriladi. Davom etasizmi?')) {
        if (confirm('Ishonchingiz komilmi? Bu amalni bekor qilib bo\'lmaydi!')) {
            Storage.clear();
            showToast('Barcha ma\'lumotlar o\'chirildi!', 'success');
            setTimeout(() => location.reload(), 1000);
        }
    }
}

document.addEventListener('DOMContentLoaded', loadSettings);
