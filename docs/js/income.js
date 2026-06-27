// Income page logic

let editingIncomeId = null;

function loadIncomePage() {
    loadCategories();
    loadCustomers();
    loadIncomes();
    
    // Bugungi sanani default qilib o'rnatish
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('incomeDate').value = today;
}

function loadCategories() {
    const categories = CategoryStorage.getAll();
    const selectElements = ['incomeCategory', 'filterCategory'];
    
    selectElements.forEach(elementId => {
        const select = document.getElementById(elementId);
        if (select) {
            // Eski optionlarni tozalash (birinchisidan tashqari)
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            // Yangi kategoriyalarni qo'shish
            categories.income.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                select.appendChild(option);
            });
        }
    });
}

function loadCustomers() {
    const customers = CustomerStorage.getAll();
    const select = document.getElementById('incomeCustomer');
    
    if (select) {
        // Eski optionlarni tozalash
        while (select.options.length > 1) {
            select.remove(1);
        }
        
        // Yangi mijozlarni qo'shish
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.fullName;
            select.appendChild(option);
        });
    }
}

function loadIncomes() {
    const incomes = IncomeStorage.getAll();
    displayIncomes(incomes);
}


function displayIncomes(incomes) {
    const tbody = document.querySelector('#incomeTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    // Sanaga ko'ra tartiblash (eng yangisi birinchi)
    incomes.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Jami summani hisoblash
    const total = incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
    document.getElementById('totalIncomeAmount').textContent = formatCurrency(total);
    
    if (incomes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: var(--text-secondary);">Hech qanday daromad topilmadi</td></tr>';
        return;
    }
    
    incomes.forEach(income => {
        const row = tbody.insertRow();
        
        // Mijoz nomini olish
        let customerName = '-';
        if (income.customer) {
            const customer = CustomerStorage.getById(income.customer);
            customerName = customer ? customer.fullName : '-';
        }
        
        row.innerHTML = `
            <td>${formatDate(income.date)}</td>
            <td class="text-success"><strong>${formatCurrency(income.amount)}</strong></td>
            <td><span class="badge badge-success">${income.category}</span></td>
            <td>${customerName}</td>
            <td>${income.paymentMethod}</td>
            <td>${income.description || '-'}</td>
            <td>
                <button class="btn-secondary" onclick="editIncome('${income.id}')" style="padding: 6px 12px; margin-right: 5px;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-danger" onclick="deleteIncome('${income.id}')" style="padding: 6px 12px;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    });
}

function openIncomeModal() {
    editingIncomeId = null;
    document.getElementById('modalTitle').textContent = 'Yangi daromad qo\'shish';
    document.getElementById('incomeForm').reset();
    
    // Bugungi sanani o'rnatish
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('incomeDate').value = today;
    
    document.getElementById('incomeModal').classList.add('active');
}

function closeIncomeModal() {
    document.getElementById('incomeModal').classList.remove('active');
    editingIncomeId = null;
}


function saveIncome(event) {
    event.preventDefault();
    
    const incomeData = {
        amount: document.getElementById('incomeAmount').value,
        category: document.getElementById('incomeCategory').value,
        customer: document.getElementById('incomeCustomer').value,
        description: document.getElementById('incomeDescription').value,
        paymentMethod: document.getElementById('incomePaymentMethod').value,
        date: document.getElementById('incomeDate').value,
        notes: document.getElementById('incomeNotes').value
    };
    
    if (editingIncomeId) {
        IncomeStorage.update(editingIncomeId, incomeData);
        showToast('Daromad muvaffaqiyatli yangilandi!', 'success');
    } else {
        IncomeStorage.add(incomeData);
        showToast('Daromad muvaffaqiyatli qo\'shildi!', 'success');
    }
    
    closeIncomeModal();
    loadIncomes();
}

function editIncome(id) {
    const income = IncomeStorage.getById(id);
    if (!income) return;
    
    editingIncomeId = id;
    document.getElementById('modalTitle').textContent = 'Daromadni tahrirlash';
    
    document.getElementById('incomeAmount').value = income.amount;
    document.getElementById('incomeCategory').value = income.category;
    document.getElementById('incomeCustomer').value = income.customer || '';
    document.getElementById('incomeDescription').value = income.description || '';
    document.getElementById('incomePaymentMethod').value = income.paymentMethod;
    document.getElementById('incomeDate').value = income.date;
    document.getElementById('incomeNotes').value = income.notes || '';
    
    document.getElementById('incomeModal').classList.add('active');
}

function deleteIncome(id) {
    if (confirm('Daromadni o\'chirmoqchimisiz?')) {
        IncomeStorage.delete(id);
        showToast('Daromad o\'chirildi!', 'success');
        loadIncomes();
    }
}

function filterIncomes() {
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;
    const category = document.getElementById('filterCategory').value;
    
    let incomes = IncomeStorage.getAll();
    
    if (dateFrom) {
        incomes = incomes.filter(income => income.date >= dateFrom);
    }
    
    if (dateTo) {
        incomes = incomes.filter(income => income.date <= dateTo);
    }
    
    if (category) {
        incomes = incomes.filter(income => income.category === category);
    }
    
    displayIncomes(incomes);
}

function resetFilters() {
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';
    document.getElementById('filterCategory').value = '';
    loadIncomes();
}

// Global qidiruv
function performSearch(query) {
    let incomes = IncomeStorage.getAll();
    
    if (query) {
        incomes = incomes.filter(income => {
            return income.description.toLowerCase().includes(query) ||
                   income.category.toLowerCase().includes(query) ||
                   income.amount.toString().includes(query);
        });
    }
    
    displayIncomes(incomes);
}

// Sahifa yuklanganda
document.addEventListener('DOMContentLoaded', () => {
    loadIncomePage();
    initGlobalSearch();
});
