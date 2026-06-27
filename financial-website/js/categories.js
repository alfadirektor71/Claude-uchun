function loadCategories() {
    const categories = CategoryStorage.getAll();
    displayCategories(categories);
}

function displayCategories(categories) {
    const incomeList = document.getElementById('incomeCategoriesList');
    const expenseList = document.getElementById('expenseCategoriesList');
    
    incomeList.innerHTML = '<div style="display: flex; flex-direction: column; gap: 10px;">';
    categories.income.forEach(cat => {
        incomeList.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
                <span><i class="fas fa-tag" style="color: var(--success); margin-right: 10px;"></i>${cat}</span>
                <button class="btn-danger" onclick="deleteIncomeCategory('${cat}')" style="padding: 6px 12px;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    incomeList.innerHTML += '</div>';
    
    expenseList.innerHTML = '<div style="display: flex; flex-direction: column; gap: 10px;">';
    categories.expense.forEach(cat => {
        expenseList.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
                <span><i class="fas fa-tag" style="color: var(--danger); margin-right: 10px;"></i>${cat}</span>
                <button class="btn-danger" onclick="deleteExpenseCategory('${cat}')" style="padding: 6px 12px;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    expenseList.innerHTML += '</div>';
}

function addIncomeCategory() {
    const name = prompt('Yangi daromad kategoriyasi nomini kiriting:');
    if (name && name.trim()) {
        CategoryStorage.addIncome(name.trim());
        loadCategories();
        showToast('Kategoriya qo\'shildi!', 'success');
    }
}

function addExpenseCategory() {
    const name = prompt('Yangi xarajat kategoriyasi nomini kiriting:');
    if (name && name.trim()) {
        CategoryStorage.addExpense(name.trim());
        loadCategories();
        showToast('Kategoriya qo\'shildi!', 'success');
    }
}

function deleteIncomeCategory(name) {
    if (confirm(`"${name}" kategoriyasini o'chirmoqchimisiz?`)) {
        CategoryStorage.deleteIncome(name);
        loadCategories();
        showToast('Kategoriya o\'chirildi!', 'success');
    }
}

function deleteExpenseCategory(name) {
    if (confirm(`"${name}" kategoriyasini o'chirmoqchimisiz?`)) {
        CategoryStorage.deleteExpense(name);
        loadCategories();
        showToast('Kategoriya o\'chirildi!', 'success');
    }
}

document.addEventListener('DOMContentLoaded', loadCategories);
