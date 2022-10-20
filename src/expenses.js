

import { button, categories, e, monthName, td, tr, getId, setData, getData } from './util';
let isEditMode = false;
let currentId = null;
const records = getData();




const tbody = document.querySelector('tbody');
const form = document.getElementById('new-expense');
const dateInput = form.querySelector('[name="date"]');

tbody.addEventListener('click', onEdit);

form.addEventListener('submit', onSubmit);

form.querySelector('button[type="reset"]').addEventListener('click', (event) => {
    isEditMode = false;
    currentId = null;
})

hydrate();


function hydrate() {
    tbody.replaceChildren(...[...records.values()].map(createRow));
}

function onSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = Object.fromEntries(formData);

    const id = isEditMode ? currentId : getId();

    const record = {
        id: id,
        ...data
    };
    records.set(record.id, record);

    const newRow = createRow(record);

    if (isEditMode) {
        const oldRow = document.getElementById(id);
        tbody.replaceChild(newRow, oldRow);
        isEditMode = false;
        currentId = null;
    } else {
        tbody.append(newRow);
    }


    form.reset();
    dateInput.value = data.date;

    setData(records);
};



function createRow(record) {
    if (Object.values(record).every(x => x) == false) {
        throw new Error('Sorry, there is a problem with your input!');
    };

    const { id, date, name, category, amount } = record;

    const parsedDate = new Date(date);
    const dateAsString = `${parsedDate.getDate()}.${monthName[parsedDate.getMonth()]}`;

    let row = tr(
        td(dateAsString),
        td(name),
        td(categories[category]),
        td(e('span', { className: 'currency' }, amount)),
        td(e('button', { className: 'editBtn' }, 'Edit'), e('button', { className: 'deleteBtn' }, 'Delete'))
    )
    row.id = id;
    return row;
}

function onEdit(event) {
    if (event.target.tagName == 'BUTTON') {
        const rowId = event.target.parentElement.parentElement.id;
        const actualRow = event.target.parentElement.parentElement;
        if (event.target.classList.contains('editBtn')) {
            edit(actualRow);
        } else if (event.target.classList.contains('deleteBtn')) {
            if (confirm('Are you sure?')) {
                actualRow.remove();
                records.delete(rowId);
                setData(records);
            }

        }
    }
}

function edit(row) {
    const record = records.get(row.id);
    form.querySelector('[name="date"]').value = record.date;
    form.querySelector('[name="name"]').value = record.name;
    form.querySelector('[name="category"]').value = record.category;
    form.querySelector('[name="amount"]').value = record.amount;

    isEditMode = true;
    currentId = row.id;
}

