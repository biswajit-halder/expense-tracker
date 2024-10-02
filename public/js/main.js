const editExpenseModal = (expenseid) => {
    fetch('/api/getexpense/' + expenseid)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // parse JSON data from the response
        })
        .then((data) => {
            if (data && data.check && data.check === 'success') {
                const expense = data.expense;
                
                document.querySelector('#mod-expense-form input#name').value = expense.name;
                document.querySelector('#mod-expense-form input#price').value = expense.price;
                document.querySelector('#mod-expense-form input#date').value = formatDateToYYYYMMDD(expense.date);
                document.querySelector('#mod-expense-form select#category').value = expense.category;
                document.querySelector('#mod-expense-form select#paid_via').value = expense.paid_via;
                document.querySelector('#mod-expense-form textarea#notes').value = expense.notes;

                document.getElementById('addExpenseModalLabel').innerHTML = 'Edit Expense';

                document.getElementById('modexpensesubmitbtn').innerHTML = 'Update';
                document.getElementById('mod-expense-form').action = '/edit-expense/' + expense._id;

                document.getElementById('addExpenseModalBtn').click();
            }
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

const deleteExpenseModal = (expenseid) => {
    fetch('/api/delete-expense/' + expenseid)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // parse JSON data from the response
        })
        .then((data) => {
            if (data && data.check && data.check === 'success') {
                window.location.reload();
            }
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}
const editIncomeModal = (incomeid) => {
    fetch('/api/getincome/' + incomeid)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // parse JSON data from the response
        })
        .then((data) => {
            if (data && data.check && data.check === 'success') {
                const income = data.income;
                
                document.querySelector('#mod-income-form input#name').value = income.name;
                document.querySelector('#mod-income-form input#amount').value = income.amount;
                document.querySelector('#mod-income-form input#date').value = formatDateToYYYYMMDD(income.date);
                document.querySelector('#mod-income-form select#category').value = income.category;
                document.querySelector('#mod-income-form textarea#notes').value = income.notes;

                document.getElementById('addIncomeModalLabel').innerHTML = 'Edit Income';

                document.getElementById('modIncomesubmitbtn').innerHTML = 'Update';
                document.getElementById('mod-income-form').action = '/edit-income/' + income._id;

                document.getElementById('addIncomeModalBtn').click();
            }
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}
const deleteIncomeModal = (expenseid) => {
    fetch('/api/delete-income/' + expenseid)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // parse JSON data from the response
        })
        .then((data) => {
            if (data && data.check && data.check === 'success') {
                window.location.reload();
            }
        })
        .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}
const formatDateToYYYYMMDD = (expensedata) => {
    const date = new Date(expensedata);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})