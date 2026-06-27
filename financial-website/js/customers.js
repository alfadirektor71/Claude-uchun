let editingCustomerId = null;

function loadCustomerPage() {
    loadCustomers();
}

function loadCustomers() {
    const customers = CustomerStorage.getAll();
    displayCustomers(customers);
}

function displayCustomers(customers) {
    const tbody = document.querySelector('#customerTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    document.getElementById('totalCustomers').textContent = customers.length;
    
    if (customers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px; color: var(--text-secondary);">Hech qanday mijoz topilmadi</td></tr>';
        return;
    }
    
    customers.forEach(customer => {
        const incomes = IncomeStorage.getAll().filter(i => i.customer === customer.id);
        const totalPayments = incomes.reduce((sum, i) => sum + parseFloat(i.amount), 0);
        const debts = DebtStorage.getAll().filter(d => d.customerId === customer.id && !d.isPaid);
        const totalDebt = debts.reduce((sum, d) => sum + parseFloat(d.amount), 0);
        
        const row = tbody.insertRow();
        row.innerHTML = `
            <td><strong>${customer.fullName}</strong></td>
            <td>${customer.phone}</td>
            <td>${customer.telegram || '-'}</td>
            <td class="text-success">${formatCurrency(totalPayments)}</td>
            <td class="${totalDebt > 0 ? 'text-danger' : ''}">${formatCurrency(totalDebt)}</td>
            <td>
                <button class="btn-secondary" onclick="viewCustomer('${customer.id}')" style="padding: 6px 12px; margin-right: 5px;">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-secondary" onclick="editCustomer('${customer.id}')" style="padding: 6px 12px; margin-right: 5px;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-danger" onclick="deleteCustomer('${customer.id}')" style="padding: 6px 12px;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    });
}

function openCustomerModal() {
    editingCustomerId = null;
    document.getElementById('modalTitle').textContent = 'Yangi mijoz qo\'shish';
    document.getElementById('customerForm').reset();
    document.getElementById('customerModal').classList.add('active');
}

function closeCustomerModal() {
    document.getElementById('customerModal').classList.remove('active');
    editingCustomerId = null;
}

function saveCustomer(event) {
    event.preventDefault();
    const customerData = {
        fullName: document.getElementById('customerName').value,
        phone: document.getElementById('customerPhone').value,
        telegram: document.getElementById('customerTelegram').value,
        notes: document.getElementById('customerNotes').value
    };
    
    if (editingCustomerId) {
        CustomerStorage.update(editingCustomerId, customerData);
        showToast('Mijoz muvaffaqiyatli yangilandi!', 'success');
    } else {
        CustomerStorage.add(customerData);
        showToast('Mijoz muvaffaqiyatli qo\'shildi!', 'success');
    }
    closeCustomerModal();
    loadCustomers();
}

function editCustomer(id) {
    const customer = CustomerStorage.getById(id);
    if (!customer) return;
    editingCustomerId = id;
    document.getElementById('modalTitle').textContent = 'Mijozni tahrirlash';
    document.getElementById('customerName').value = customer.fullName;
    document.getElementById('customerPhone').value = customer.phone;
    document.getElementById('customerTelegram').value = customer.telegram || '';
    document.getElementById('customerNotes').value = customer.notes || '';
    document.getElementById('customerModal').classList.add('active');
}

function deleteCustomer(id) {
    if (confirm('Mijozni o\'chirmoqchimisiz?')) {
        CustomerStorage.delete(id);
        showToast('Mijoz o\'chirildi!', 'success');
        loadCustomers();
    }
}

function viewCustomer(id) {
    const customer = CustomerStorage.getById(id);
    if (!customer) return;
    
    const incomes = IncomeStorage.getAll().filter(i => i.customer === id);
    const totalPayments = incomes.reduce((sum, i) => sum + parseFloat(i.amount), 0);
    const debts = DebtStorage.getAll().filter(d => d.customerId === id);
    const totalDebt = debts.filter(d => !d.isPaid).reduce((sum, d) => sum + parseFloat(d.amount), 0);
    
    let historyHtml = '<p style="color: var(--text-secondary);">Hech qanday to\'lov tarixi yo\'q</p>';
    if (incomes.length > 0) {
        historyHtml = '<table style="width: 100%; margin-top: 15px;"><thead><tr><th>Sana</th><th>Miqdor</th><th>Kategoriya</th></tr></thead><tbody>';
        incomes.forEach(income => {
            historyHtml += `<tr><td>${formatDate(income.date)}</td><td class="text-success">${formatCurrency(income.amount)}</td><td>${income.category}</td></tr>`;
        });
        historyHtml += '</tbody></table>';
    }
    
    const content = `
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
            <div class="stat-card">
                <div class="stat-info">
                    <p class="stat-label">To'liq ism</p>
                    <h3 class="stat-value" style="font-size: 18px;">${customer.fullName}</h3>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-info">
                    <p class="stat-label">Telefon</p>
                    <h3 class="stat-value" style="font-size: 18px;">${customer.phone}</h3>
                </div>
            </div>
            <div class="stat-card income">
                <div class="stat-info">
                    <p class="stat-label">Jami to'lovlar</p>
                    <h3 class="stat-value" style="font-size: 18px;">${formatCurrency(totalPayments)}</h3>
                </div>
            </div>
            <div class="stat-card expense">
                <div class="stat-info">
                    <p class="stat-label">Qarz</p>
                    <h3 class="stat-value" style="font-size: 18px;">${formatCurrency(totalDebt)}</h3>
                </div>
            </div>
        </div>
        <h3 style="margin-bottom: 15px;">To'lov tarixi</h3>
        ${historyHtml}
    `;
    
    document.getElementById('customerDetailContent').innerHTML = content;
    document.getElementById('customerDetailModal').classList.add('active');
}

function closeCustomerDetailModal() {
    document.getElementById('customerDetailModal').classList.remove('active');
}

function performSearch(query) {
    let customers = CustomerStorage.getAll();
    if (query) {
        customers = customers.filter(customer => {
            return customer.fullName.toLowerCase().includes(query) ||
                   customer.phone.includes(query) ||
                   (customer.telegram && customer.telegram.toLowerCase().includes(query));
        });
    }
    displayCustomers(customers);
}

document.addEventListener('DOMContentLoaded', () => {
    loadCustomerPage();
    initGlobalSearch();
});
