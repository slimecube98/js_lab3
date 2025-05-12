let transactions = [
    {
        id: '1001',
        date: '2025-05-12',
        amount: -23.50,
        category: 'Food',
        description: 'Lunch at cafe'
    },
    {
        id: '1002',
        date: '2025-05-12',
        amount: -120.00,
        category: 'Transport',
        description: 'Monthly bus pass'
    },
    {
        id: '1003',
        date: '2025-05-12',
        amount: -45.75,
        category: 'Entertainment',
        description: 'Movie and snacks'
    },
    {
        id: '1004',
        date: '2025-05-12',
        amount: -8.90,
        category: 'Coffee',
        description: 'Latte and croissant'
    },
    {
        id: '1005',
        date: '2025-05-12',
        amount: 200.00,
        category: 'Salary',
        description: 'Oh, yeah, I got paid!'
    }
];

/**
 * Добавляет новую транзакцию в массив transactions.
 * @param {string} date - Дата транзакции.
 * @param {number} amount - Сумма транзакции.
 * @param {string} category - Категория транзакции.
 * @param {string} description - Описание транзакции.
 * @returns {Object} Добавленная транзакция.
 */
function addTransaction(date, amount, category, description) {
    let transaction = {
        id: `${new Date().valueOf()}`,
        date,
        amount,
        category,
        description
    };
    transactions.push(transaction);
    return transaction;
}

/**
 * Удаляет транзакцию по её идентификатору.
 * @param {string} transactionId - Идентификатор транзакции.
 */
function deleteTransactionById(transactionId) {
    transactions = transactions.filter(transaction => transaction.id != transactionId);
}

/**
 * Вычисляет общую сумму всех транзакций.
 * @returns {number} Общая сумма.
 */
function calculateTotal() {
    return transactions.reduce((total, transaction) => total += transaction.amount, 0)
}

/**
 * Создаёт ячейку таблицы с заданным значением.
 * @param {number} value - Значение для отображения в ячейке.
 * @returns {HTMLTableCellElement} Ячейка таблицы.
 */
function createTableDataCell(value) {
    const cell = document.createElement('td');
    cell.textContent = value;
    return cell;
}

/**
 * Создаёт ячейку таблицы с кнопкой удаления.
 * @param {string} id - Идентификатор транзакции.
 * @returns {HTMLTableCellElement} Ячейка с кнопкой удаления.
 */
function createDeleteButtonCell(id) {
    const button = document.createElement('button');
    button.textContent = 'Delete';
    
    const cell = document.createElement('td');
    cell.appendChild(button);

    return cell;
}

/**
 * Отображает одну транзакцию в таблице.
 * @param {Object} transaction - Объект транзакции.
 */
function displayTransaction(transaction) {
    const tableBody = document.getElementById('transactions-table').querySelector('tbody');

    const row = document.createElement('tr');
    row.setAttribute('data-id', transaction.id);
    row.setAttribute('class', transaction.amount > 0 ? 'income' : 'expense');

    // Id column
    row.appendChild(createTableDataCell(transaction.id));

    // Date column
    row.appendChild(createTableDataCell(new Date(transaction.date).toLocaleDateString()));

    // Category column
    row.appendChild(createTableDataCell(transaction.category));

    // Amount column
    row.appendChild(createTableDataCell(transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })));

    // Description column
    row.appendChild(createTableDataCell(transaction.description.split(' ').slice(0, 4).join(' ')));

    // Delete button column
    row.appendChild(createDeleteButtonCell());

    tableBody.appendChild(row);

}

/**
 * Создаёт параграф с заданным текстом.
 * @param {string} text - Текст параграфа.
 * @returns {HTMLParagraphElement} Параграф.
 */
function createParagraph(text) {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
}

/**
 * Показывает подробную информацию о транзакции.
 * @param {number|string} id - Идентификатор транзакции.
 */
function showTransactionDetails(id) {
    const transaction = transactions.find(transaction => transaction.id == id);
    const transactionDetailsContainer = document.getElementById('transaction-details');
    transactionDetailsContainer.innerHTML = '';
    if (transaction) {
        const title = document.createElement('h2');
        title.textContent = `Детали транзакции ${transaction.id}`;
        transactionDetailsContainer.appendChild(title);

        transactionDetailsContainer.appendChild(createParagraph(`Дата: ${new Date(transaction.date).toLocaleDateString()}`));
        transactionDetailsContainer.appendChild(createParagraph(`Категория: ${transaction.category}`));
        transactionDetailsContainer.appendChild(createParagraph(`Сумма: ${transaction.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`));
        transactionDetailsContainer.appendChild(createParagraph(`Описание: ${transaction.description}`));
    } else {
        transactionDetailsContainer.appendChild(createParagraph('Транзакция не найдена'));
    }

    transactionDetailsContainer.style.display = 'block';
}

/**
 * Отображает общую сумму всех транзакций на странице.
 */
function displayTotal() {
    const total = calculateTotal();
    const totalElement = document.getElementById('total-amount');
    totalElement.textContent = `${total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`;
}

/**
 * Обрабатывает клик по строке таблицы (удаление или просмотр деталей).
 * @param {MouseEvent} event - Событие клика.
 */
function handleTableRowClick(event) {
    // Button we have only for delete
    const transactionId = event.target.closest('tr').getAttribute('data-id');
    if (event.target.tagName === 'BUTTON') {
        // Delete transaction from array
        deleteTransactionById(transactionId);
        // Remove transaction from table
        event.target.closest('tr').remove();
        // Recalculate total
        displayTotal();
    } else {
        showTransactionDetails(transactionId);
    }
}

/**
 * Обрабатывает отправку формы для добавления новой транзакции.
 * @param {Event} event - Событие отправки формы.
 */
function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const date = form.elements['transaction-date'].value;
    const amount = parseFloat(form.elements['transaction-amount'].value);
    const category = form.elements['transaction-category'].value;
    const description = form.elements['transaction-description'].value;

    let newTransaction = addTransaction(date, amount, category, description);
    displayTransaction(newTransaction);
    // Recalculate total
    displayTotal();

    // Reset the form
    form.reset();
}

/**
 * Инициализирует обработчики событий и отображает начальные данные.
 */
function init() {
    //1. We need to handle clicks
    const table = document.getElementById('transactions-table');
    table.addEventListener('click', handleTableRowClick);

    //2. we need to handle form submit
    const form = document.getElementById('new-transaction-form');
    form.addEventListener('submit', handleFormSubmit);

    //3. We need to render all transactions
    transactions.forEach(displayTransaction);

    displayTotal();
}

document.addEventListener('DOMContentLoaded', init);