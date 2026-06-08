export function exportToCSV(transactions, filename = 'fintrack-transactions') {
  if (!transactions || transactions.length === 0) return false;

  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount (INR)'];

  const rows = transactions.map(t => [
    new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    t.type.charAt(0).toUpperCase() + t.type.slice(1),
    t.category,
    t.description || '-',
    t.type === 'income' ? `+${t.amount}` : `-${t.amount}`,
  ]);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  const csvContent = [
    ['FinTrack Pro - Transaction Export'],
    [`Generated on: ${new Date().toLocaleDateString('en-IN')}`],
    [`Total Transactions: ${transactions.length}`],
    [],
    headers,
    ...rows,
    [],
    ['', '', '', 'Total Income:', `+${totalIncome}`],
    ['', '', '', 'Total Expenses:', `-${totalExpense}`],
    ['', '', '', 'Net Savings:', `${totalIncome - totalExpense}`],
  ]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}
