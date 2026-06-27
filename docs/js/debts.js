let editingDebtId = null;

function loadDebtPage() {
    loadDebts();
    updateStats();
}

function updateStats() {
    const debts = DebtStorage.getAll();
    const receivable = debts.filter(d => d.type === 'receive' && !d.isPaid).reduce((sum, d) => sum + parseFloat(d.amount), 0);
    const payable = debts.filter(d => d.type === 'pay' && !d.isPaid).reduce((sum, d) => sum + parseFloat(d.amount), 0);
    document.getElementById('totalReceivable').textContent = formatCurrency(receivable);
    document.getElementById('totalPayable').textContent = formatCurrency(payable);
}

function loadDebts() {
    const debts = DebtStorage.getAll();
    displayDebts(debts);
}

function displayDebts(debts) {
    const tbody = document.querySelector('#debtTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    if (debts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--text-secondary);">Hech qanday qarz topilmadi</td></tr>';
        return;
    }
    
    debts.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    
    debts.forEach(debt => {
        const row = tbody.insertRow();
        const typeClass = debt.type === 'receive' ? 'success' : 'danger';
        const statusClass = debt.isPaid ? 'success' : 'warning';
        const isOverdue = !debt.isPaid && debt.dueDate && new Date(debt.dueDate) < new Date();
        
        row.innerHTML = `
            <td><span class="badge badge-${typeClass}">${debt.type === 'receive' ? 'Olish' : 'To\'lash'}</span></td>
            <td><strong>${debt.personName}</strong></td>
            <td class="text-${typeClass}">${formatCurrency(debt.amount)}</td>
            <td>${debt.dueDate ? formatDate(debt.dueDate) : '-'}${isOverdue ? ' <span class="badge badge-danger">Muddati o\'tgan</span>' : ''}</td>
            <td><span class="badge badge-${statusClass}">${debt.isPaid ? 'To\'langan' : 'Kutilmoqda'}</span></td>
            <td>${debt.notes || '-'}</td>
            <td>
                ${!debt.isPaid ? `<button class="btn-success" onclick="markAsPaid('${debt.id}')" style="padding: 6px 12px; margin-right: 5px;">
                    <i class="fas fa-check"></i>
                </button>` : ''}
                <button class="btn-secondary" onclick="editDebt('${debt.id}')" style="padding: 6px 12px; margin-right: 5px;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-danger" onclick="deleteDebt('${debt.id}')" style="padding: 6px 12px;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    });
}

function openDebtModal() {
    editingDebtId = null;
    document.getElementById('modalTitle').textContent = 'Yangi qarz qo\'shish';
    document.getElementById('debtForm').reset();
    document.getElementById('debtModal').classList.add('active');
}

function closeDebtModal() {
    document.getElementById('debtModal').classList.remove('active');
    editingDebtId = null;
}

function saveDebt(event) {
    event.preventDefault();
    const debtData = {
        type: document.getElementById('debtType').value,
        personName: document.getElementById('debtName').value,
        amount: document.getElementById('debtAmount').value,
        dueDate: document.getElementById('debtDueDate').value,
        notes: document.getElementById('debtNotes').value,
        isPaid: false
    };
    
    if (editingDebtId) {
        DebtStorage.update(editingDebtId, debtData);
        showToast('Qarz muvaffaqiyatli yangilandi!', 'success');
    } else {
        DebtStorage.add(debtData);
        showToast('Qarz muvaffaqiyatli qo\'shildi!', 'success');
    }
    closeDebtModal();
    loadDebts();
    updateStats();
}

function editDebt(id) {
    const debt = DebtStorage.getById(id);
    if (!debt) return;
    editingDebtId = id;
    document.getElementById('modalTitle').textContent = 'Qarzni tahrirlash';
    document.getElementById('debtType').value = debt.type;
    document.getElementById('debtName').value = debt.personName;
    document.getElementById('debtAmount').value = debt.amount;
    document.getElementById('debtDueDate').value = debt.dueDate || '';
    document.getElementById('debtNotes').value = debt.notes || '';
    document.getElementById('debtModal').classList.add('active');
}

function deleteDebt(id) {
    if (confirm('Qarzni o\'chirmoqchimisiz?')) {
        DebtStorage.delete(id);
        showToast('Qarz o\'chirildi!', 'success');
        loadDebts();
        updateStats();
    }
}

function markAsPaid(id) {
    if (confirm('Qarz to\'langanmi?')) {
        DebtStorage.update(id, { isPaid: true });
        showToast('Qarz to\'langan deb belgilandi!', 'success');
        loadDebts();
        updateStats();
    }
}

function filterDebts(type) {
    let debts = DebtStorage.getAll();
    if (type !== 'all') {
        debts = debts.filter(d => d.type === type);
    }
    displayDebts(debts);
}

function performSearch(query) {
    let debts = DebtStorage.getAll();
    if (query) {
        debts = debts.filter(debt => {
            return debt.personName.toLowerCase().includes(query) ||
                   debt.amount.toString().includes(query);
        });
    }
    displayDebts(debts);
}

document.addEventListener('DOMContentLoaded', () => {
    loadDebtPage();
    initGlobalSearch();
});
