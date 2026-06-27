let currentReportData = null;

function generateReport() {
    const dateFrom = document.getElementById('reportDateFrom').value;
    const dateTo = document.getElementById('reportDateTo').value;
    
    if (!dateFrom || !dateTo) {
        showToast('Sana oralig\'ini tanlang!', 'error');
        return;
    }
    
    const incomes = IncomeStorage.getAll().filter(i => i.date >= dateFrom && i.date <= dateTo);
    const expenses = ExpenseStorage.getAll().filter(e => e.date >= dateFrom && e.date <= dateTo);
    
    const totalIncome = incomes.reduce((sum, i) => sum + parseFloat(i.amount), 0);
    const totalExpense = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);
    const profit = totalIncome - totalExpense;
    
    currentReportData = { dateFrom, dateTo, incomes, expenses, totalIncome, totalExpense, profit };
    
    document.getElementById('reportIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('reportExpense').textContent = formatCurrency(totalExpense);
    document.getElementById('reportProfit').textContent = formatCurrency(profit);
    
    let detailsHTML = '<h4>Daromadlar</h4><table style="width: 100%; margin-bottom: 30px;"><thead><tr><th>Sana</th><th>Miqdor</th><th>Kategoriya</th><th>Izoh</th></tr></thead><tbody>';
    incomes.forEach(income => {
        detailsHTML += `<tr><td>${formatDate(income.date)}</td><td class="text-success">${formatCurrency(income.amount)}</td><td>${income.category}</td><td>${income.description || '-'}</td></tr>`;
    });
    detailsHTML += '</tbody></table>';
    
    detailsHTML += '<h4>Xarajatlar</h4><table style="width: 100%;"><thead><tr><th>Sana</th><th>Miqdor</th><th>Kategoriya</th><th>Izoh</th></tr></thead><tbody>';
    expenses.forEach(expense => {
        detailsHTML += `<tr><td>${formatDate(expense.date)}</td><td class="text-danger">${formatCurrency(expense.amount)}</td><td>${expense.category}</td><td>${expense.description || '-'}</td></tr>`;
    });
    detailsHTML += '</tbody></table>';
    
    document.getElementById('reportDetails').innerHTML = detailsHTML;
    document.getElementById('reportContent').style.display = 'block';
    showToast('Hisobot tayyor!', 'success');
}

function exportPDF() {
    if (!currentReportData) return;
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Moliyaviy Hisobot', 14, 20);
    doc.setFontSize(11);
    doc.text(`Sana: ${formatDate(currentReportData.dateFrom)} - ${formatDate(currentReportData.dateTo)}`, 14, 30);
    
    doc.text(`Jami Daromad: ${formatCurrency(currentReportData.totalIncome)}`, 14, 40);
    doc.text(`Jami Xarajat: ${formatCurrency(currentReportData.totalExpense)}`, 14, 47);
    doc.text(`Sof Foyda: ${formatCurrency(currentReportData.profit)}`, 14, 54);
    
    doc.autoTable({
        head: [['Sana', 'Turi', 'Kategoriya', 'Miqdor']],
        body: [
            ...currentReportData.incomes.map(i => [formatDate(i.date), 'Daromad', i.category, formatCurrency(i.amount)]),
            ...currentReportData.expenses.map(e => [formatDate(e.date), 'Xarajat', e.category, formatCurrency(e.amount)])
        ],
        startY: 60
    });
    
    doc.save(`hisobot_${currentReportData.dateFrom}_${currentReportData.dateTo}.pdf`);
    showToast('PDF yuklandi!', 'success');
}

function exportExcel() {
    if (!currentReportData) return;
    
    const data = [
        ['Moliyaviy Hisobot'],
        [`Sana: ${formatDate(currentReportData.dateFrom)} - ${formatDate(currentReportData.dateTo)}`],
        [],
        ['Jami Daromad', formatCurrency(currentReportData.totalIncome)],
        ['Jami Xarajat', formatCurrency(currentReportData.totalExpense)],
        ['Sof Foyda', formatCurrency(currentReportData.profit)],
        [],
        ['Sana', 'Turi', 'Kategoriya', 'Miqdor', 'Izoh'],
        ...currentReportData.incomes.map(i => [formatDate(i.date), 'Daromad', i.category, i.amount, i.description || '']),
        ...currentReportData.expenses.map(e => [formatDate(e.date), 'Xarajat', e.category, e.amount, e.description || ''])
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hisobot');
    XLSX.writeFile(wb, `hisobot_${currentReportData.dateFrom}_${currentReportData.dateTo}.xlsx`);
    showToast('Excel yuklandi!', 'success');
}

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    document.getElementById('reportDateFrom').value = firstDay.toISOString().split('T')[0];
    document.getElementById('reportDateTo').value = today.toISOString().split('T')[0];
});
