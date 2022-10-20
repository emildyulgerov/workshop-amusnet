/**
 * 
 * @param {string} type
 * @param {Object} attribute
 * @param {...{string|Node}} content
 * @returns {HTMLElement}
 */



 export function e(type, attributes, ...content){
    const res = document.createElement(type);

    for (let key in attributes){
        if (key.slice(0, 2) == 'on'){
            res.addEventListener(key.slice(2), attributes[key])
        } else {
        res[key] = attributes[key];
        }
    }
    for (let item of content){
        res.append(item);
    }
    return res;
}
export const th = e.bind(null, 'th', {});
export const tr = e.bind(null, 'tr', {});
export const td = e.bind(null, 'td', {});
export const categories = {
    '0': 'Other',
    '1': 'Utilities',
    '2': 'Groceries',
    '3': 'Entertainment',
    '4': 'Transport'
}
export const button = (label, onClick, attributes = {}) => e('button', Object.assign(attributes, { onclick: onClick }), label);

export const monthName = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

export function getId(){
    return (Math.random() * 99999999 | 0).toString(16)
}

export function setData(data){
    const values = [...data.values()];
    localStorage.setItem('records', JSON.stringify(values));
}

export function getData(){
    const values = JSON.parse(localStorage.getItem('records'));
    return new Map(values.map(e => [e.id, e]));
}


export function setBudgetData(data){
    const newValues = [...data.values()];
    localStorage.setItem('budgetRecords', JSON.stringify(newValues));
}

export function getBudgetData(){
    const newValues = JSON.parse(localStorage.getItem('budgetRecords'));
    return new Map(newValues.map(e => [e.id, e]));
}
