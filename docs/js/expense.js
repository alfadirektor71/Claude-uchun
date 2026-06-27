let editingExpenseId = null;

function loadExpensePage() {
    loadCategories();
    loadExpenses();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expenseDate').value = today;
}

function loadCategories() {
    const categories = CategoryStorage.getAll();
    const selectElements = ['expenseCategory', 'filterCategory'];
    selectElements.forEach(elementId => {
        const select = document.getElementById(elementId);
        if (select) {
            while (select.options.length > 1) select.remove(1);
            categories.expense.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                select.appendChild(option);
            });
        }
    });
}

function loadExpenses() {
    const expenses = ExpenseStorage.getAll();
    displayExpenses(expenses);
}

function displayExpenses(expenses) {
    const tbody = document.querySelector('#expenseTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    document.getElementById('totalExpenseAmount').textContent = formatCurrency(total);
    
    if (expenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--text-secondary);">Hech qanday xarajat topilmadi</td></tr>';
        return;
    }
    
    expenses.forEach(expense => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${formatDate(expense.date)}</td>
            <td class="text-danger"><strong>${formatCurrency(expense.amount)}</strong></td>
            <td><span class="badge badge-danger">${expense.category}</span></td>
            <td>${expense.supplier || '-'}</td>
            <td>${expense.paymentMethod}</td>
            <td>${expense.description || '-'}</td>
            <td>
                <button class="btn-secondary" onclick="editExpense('${expense.id}')" style="padding: 6px 12px; margin-right: 5px;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-danger" onclick="deleteExpense('${expense.id}')" style="padding: 6px 12px;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    });
}

function openExpenseModal() {
    editingExpenseId = null;
    document.getElementById('modalTitle').textContent = 'Yangi xarajat qo\'shish';
    document.getElementById('expenseForm').reset();
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expenseDate').value = today;
    document.getElementById('expenseModal').classList.add('active');
}

function closeExpenseModal() {
    document.getElementById('expenseModal').classList.remove('active');
    editingExpenseId = null;
}

function saveExpense(event) {
    event.preventDefault();
    const expenseData = {
        amount: document.getElementById('expenseAmount').value,
        category: document.getElementById('expenseCategory').value,
        supplier: document.getElementById('expenseSupplier').value,
        description: document.getElementById('expenseDescription').value,
        paymentMethod: document.getElementById('expensePaymentMethod').value,
        date: document.getElementById('expenseDate').value,
        notes: document.getElementById('expenseNotes').value
    };
    
    if (editingExpenseId) {
        ExpenseStorage.update(editingExpenseId, expenseData);
        showToast('Xarajat muvaffaqiyatli yangilandi!', 'success');
    } else {
        ExpenseStorage.add(expenseData);
        showToast('Xarajat muvaffaqiyatli qo\'shildi!', 'success');
    }
    closeExpenseModal();
    loadExpenses();
}

function editExpense(id) {
    const expense = ExpenseStorage.getById(id);
    if (!expense) return;
    editingExpenseId = id;
    document.getElementById('modalTitle').textContent = 'Xarajatni tahrirlash';
    document.getElementById('expenseAmount').value = expense.amount;
    document.getElementById('expenseCategory').value = expense.category;
    document.getElementById('expenseSupplier').value = expense.supplier || '';
    document.getElementById('expenseDescription').value = expense.description || '';
    document.getElementById('expensePaymentMethod').value = expense.paymentMethod;
    document.getElementById('expenseDate').value = expense.date;
    document.getElementById('expenseNotes').value = expense.notes || '';
    document.getElementById('expenseModal').classList.add('active');
}

function deleteExpense(id) {
    if (confirm('Xarajatni o\'chirmoqchimisiz?')) {
        ExpenseStorage.delete(id);
        showToast('Xarajat o\'chirildi!', 'success');
        loadExpenses();
    }
}

function filterExpenses() {
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;
    const category = document.getElementById('filterCategory').value;
    let expenses = ExpenseStorage.getAll();
    if (dateFrom) expenses = expenses.filter(e => e.date >= dateFrom);
    if (dateTo) expenses = expenses.filter(e => e.date <= dateTo);
    if (category) expenses = expenses.filter(e => e.category === category);
    displayExpenses(expenses);
}

function resetFilters() {
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';
    document.getElementById('filterCategory').value = '';
    loadExpenses();
}

function performSearch(query) {
    let expenses = ExpenseStorage.getAll();
    if (query) {
        expenses = expenses.filter(expense => {
            return expense.description.toLowerCase().includes(query) ||
                   expense.category.toLowerCase().includes(query) ||
                   expense.supplier.toLowerCase().includes(query) ||
                   expense.amount.toString().includes(query);
        });
    }
    displayExpenses(expenses);
}

document.addEventListener('DOMContentLoaded', () => {
    loadExpensePage();
    initGlobalSearch();
});
