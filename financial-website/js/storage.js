// LocalStorage boshqaruv funksiyalari

const Storage = {
    // Ma'lumotni saqlash
    save(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Saqlashda xatolik:', error);
            return false;
        }
    },

    // Ma'lumotni olish
    get(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Ma\'lumot olishda xatolik:', error);
            return null;
        }
    },

    // Ma'lumotni o'chirish
    remove(key) {
        localStorage.removeItem(key);
    },

    // Barcha ma'lumotni o'chirish
    clear() {
        localStorage.clear();
    }
};

// Daromadlarni boshqarish
const IncomeStorage = {
    getAll() {
        return Storage.get('incomes') || [];
    },

    add(income) {
        const incomes = this.getAll();
        income.id = Date.now().toString();
        income.createdAt = new Date().toISOString();
        incomes.push(income);
        Storage.save('incomes', incomes);
        return income;
    },

    update(id, updatedIncome) {
        let incomes = this.getAll();
        incomes = incomes.map(income => 
            income.id === id ? { ...income, ...updatedIncome } : income
        );
        Storage.save('incomes', incomes);
    },


    delete(id) {
        let incomes = this.getAll();
        incomes = incomes.filter(income => income.id !== id);
        Storage.save('incomes', incomes);
    },

    getById(id) {
        const incomes = this.getAll();
        return incomes.find(income => income.id === id);
    }
};

// Xarajatlarni boshqarish
const ExpenseStorage = {
    getAll() {
        return Storage.get('expenses') || [];
    },

    add(expense) {
        const expenses = this.getAll();
        expense.id = Date.now().toString();
        expense.createdAt = new Date().toISOString();
        expenses.push(expense);
        Storage.save('expenses', expenses);
        return expense;
    },

    update(id, updatedExpense) {
        let expenses = this.getAll();
        expenses = expenses.map(expense => 
            expense.id === id ? { ...expense, ...updatedExpense } : expense
        );
        Storage.save('expenses', expenses);
    },

    delete(id) {
        let expenses = this.getAll();
        expenses = expenses.filter(expense => expense.id !== id);
        Storage.save('expenses', expenses);
    },

    getById(id) {
        const expenses = this.getAll();
        return expenses.find(expense => expense.id === id);
    }
};

// Mijozlarni boshqarish
const CustomerStorage = {
    getAll() {
        return Storage.get('customers') || [];
    },


    add(customer) {
        const customers = this.getAll();
        customer.id = Date.now().toString();
        customer.createdAt = new Date().toISOString();
        customers.push(customer);
        Storage.save('customers', customers);
        return customer;
    },

    update(id, updatedCustomer) {
        let customers = this.getAll();
        customers = customers.map(customer => 
            customer.id === id ? { ...customer, ...updatedCustomer } : customer
        );
        Storage.save('customers', customers);
    },

    delete(id) {
        let customers = this.getAll();
        customers = customers.filter(customer => customer.id !== id);
        Storage.save('customers', customers);
    },

    getById(id) {
        const customers = this.getAll();
        return customers.find(customer => customer.id === id);
    }
};

// Qarzlarni boshqarish
const DebtStorage = {
    getAll() {
        return Storage.get('debts') || [];
    },

    add(debt) {
        const debts = this.getAll();
        debt.id = Date.now().toString();
        debt.createdAt = new Date().toISOString();
        debts.push(debt);
        Storage.save('debts', debts);
        return debt;
    },

    update(id, updatedDebt) {
        let debts = this.getAll();
        debts = debts.map(debt => 
            debt.id === id ? { ...debt, ...updatedDebt } : debt
        );
        Storage.save('debts', debts);
    },


    delete(id) {
        let debts = this.getAll();
        debts = debts.filter(debt => debt.id !== id);
        Storage.save('debts', debts);
    },

    getById(id) {
        const debts = this.getAll();
        return debts.find(debt => debt.id === id);
    }
};

// Kategoriyalarni boshqarish
const CategoryStorage = {
    getAll() {
        const categories = Storage.get('categories');
        if (!categories) {
            // Default kategoriyalar
            const defaultCategories = {
                income: ['Sotuv', 'Xizmat', 'Reklama', 'Referal', 'Boshqa'],
                expense: ['Maosh', 'Ofis', 'Internet', 'Marketing', 'Ijara', 'Soliq', 'Boshqa']
            };
            Storage.save('categories', defaultCategories);
            return defaultCategories;
        }
        return categories;
    },

    addIncome(category) {
        const categories = this.getAll();
        if (!categories.income.includes(category)) {
            categories.income.push(category);
            Storage.save('categories', categories);
        }
    },

    addExpense(category) {
        const categories = this.getAll();
        if (!categories.expense.includes(category)) {
            categories.expense.push(category);
            Storage.save('categories', categories);
        }
    },

    deleteIncome(category) {
        const categories = this.getAll();
        categories.income = categories.income.filter(cat => cat !== category);
        Storage.save('categories', categories);
    },

    deleteExpense(category) {
        const categories = this.getAll();
        categories.expense = categories.expense.filter(cat => cat !== category);
        Storage.save('categories', categories);
    }
};
