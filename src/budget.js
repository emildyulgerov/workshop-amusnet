import { button, e, monthName, tr, td, setBudgetData, getBudgetData } from "./util";

const form = document.getElementById('new-budget');
const tbody = document.querySelector('tbody');

form.addEventListener('submit', onSubmit);
tbody.addEventListener('click', editOrDelete);

let allRecords = getBudgetData();
let editMode = false;
let currentId = null;

form.querySelector('button[type="reset"]').addEventListener('click', (event) => {
    editMode = false;
    currentId = null;
})

hydrate();

function hydrate() {
    tbody.replaceChildren(...[...allRecords.values()].map(createRow));
}


function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = Object.fromEntries(formData);

    const id = editMode ? currentId : `${monthName[Number(data.month.slice(0, 2)) - 1]}.${data.month.slice(3)}`;

    const rec = {
        id: id,
        ...data
    }

 
  
    const newRow = createRow(data);

    if (editMode) {
        const oldRow = document.getElementById(rec.id);
        tbody.replaceChild(newRow, oldRow);
        editMode = false;
    } else {
        if (allRecords.has(rec.id)) {
            alert('You already have a budget for this month.');
            return;
        } else {
            tbody.append(newRow);
        }

    }

    allRecords.set(rec.id, rec);

    setBudgetData(allRecords);
    form.reset();
}

function createRow(data) {

    if (Object.values(data).every(x => x) == false) {
        throw new Error('Hey, something is missing in your input!')
    }

    const { month, income, budget } = data;

    const parsedMonth = (Number(month.slice(0, 2)) - 1);

    const parsedDate = `${monthName[parsedMonth]}.${data.month.slice(3)}`;

    let row = tr(
        td(parsedDate),
        td(e('span', { className: 'currencyIncome' }, income)),
        td(e('span', { className: 'currencyBudget' }, budget)),
        td(e('button', { className: 'editBtn' }, 'Edit'), e('button', { className: 'deleteBtn' }, 'Delete')),
    )
    row.id = parsedDate;
    return row;
}

function editOrDelete(event) {
    if (event.target.tagName == "BUTTON") {
        const actualRow = event.target.parentElement.parentElement;
        const rowId = actualRow.id;
        if (event.target.classList.contains('editBtn')) {
            edit(actualRow);
        } else if (event.target.classList.contains('deleteBtn')) {
            if (confirm('Are you sure?')) {
                actualRow.remove();
                allRecords.delete(rowId);
                setBudgetData(allRecords);
            }
        }
    }
}

function edit(row) {
    const rec = allRecords.get(row.id);
    form.querySelector('[name="month"]').value = rec.month;
    form.querySelector('[name="income"]').value = rec.income;
    form.querySelector('[name="budget"]').value = rec.budget;

    editMode = true;
    currentId = row.id;
}



window.allRecords = allRecords;
window.editMode = editMode;

