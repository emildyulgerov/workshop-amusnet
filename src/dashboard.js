

import { categories, e, getBudgetData, getData } from "./util";

const div = document.getElementById('breakdown');

const records = getData();

const sum = summarize(records,categories);
//console.log(Object.values(sum).reduce((acc, x) => acc + Number(x), 0)) //reducer to find total spendings for the month
const totalSpentMoney = (Object.values(sum).reduce((acc,x) => acc + Number(x), 0));

let maxValue = Math.max(...Object.values(sum));
let rows = Object.entries(sum).map(([name, value]) => createRow(name, value, maxValue));
div.replaceChildren(...rows);

const totalIncome = Array.from(getBudgetData()).reduce((acc, x) => acc + Number(x[1].income), 0);
const totalBudget = Array.from(getBudgetData()).reduce((acc, x) => acc + Number(x[1].budget), 0);

function summarize(records, categories){
    let summaryObj = {};

    for (let r of records.values()){
        const catId = r.category;
        if (summaryObj.hasOwnProperty(catId) == false){
            summaryObj[catId] = [];
        }
        summaryObj[catId].push(r);
    }

    for (let key in summaryObj){
        summaryObj[key] = summaryObj[key].reduce((a, b) => a + Number(b.amount), 0);
    }

    return Object.fromEntries(Object.entries(summaryObj).map(([catId, sum]) => [categories[catId], sum]));
};

function createRow(name, value, maxValue){
    let bar = e('span', {className: 'bar'});
    bar.style.width = `${value / maxValue * 400 | 0}px`;

    let res = e('div', {className: 'cat-row'},
    e('span', {className: 'row label'}, name),
    e('span', {className: 'row value'}, value),
    e('div', {className: 'bar-area'}, bar));
    return res;
}

let spentCol = document.getElementById('spent');
spentCol.innerText = totalSpentMoney;
let remainingCol = document.getElementById('remaining');
remainingCol.innerText = totalBudget - totalSpentMoney;
let savingsCol = document.getElementById('savings');
savingsCol.innerText = totalIncome - totalBudget;

let barForSpent = document.getElementById('spentCol');
barForSpent.style.height = `${totalSpentMoney / totalIncome * 300 | 0}px`;
let barForRemaining = document.getElementById('remainingCol');
barForRemaining.style.height = `${(totalBudget - totalSpentMoney) / totalIncome * 300 | 0}px`;
let barForSavings = document.getElementById('savingsCol');
barForSavings.style.height = `${(totalIncome - totalBudget) / totalIncome * 300 | 0}px`;



