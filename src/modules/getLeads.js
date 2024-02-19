import config from '../../config';
import formattedTime from '../modules/formattedTime';
import moneyMask from '../modules/moneyMask';
import { sortLeadsByBudget, sortLeadsByName } from '../modules/sortLeads';

const API_BASE_URL = config.API_BASE_URL;
const CORS_DISABLE = config.CORS_DISABLE;
const LEADS_URL = config.LEADS_URL;

let leads = [];
let nameSort = false;
let budgetSort = false;

const selectValue = document.querySelector('.form-select');
const sortByNameBtn = document.querySelector('.sort-by-name-btn');
const sortByBudgetBtn = document.querySelector('.sort-by-budget-btn');

const setSelectValue = (value) => {
	selectValue.value = value;
	localStorage.setItem('selectedValue', value);
};

selectValue.addEventListener('change', (event) => {
	setSelectValue(event.target.value);
});

// render table
const renderTable = (leadsData) => {
	const tableBody = document.getElementById('tableBody');
	tableBody.innerHTML = '';

	// Добавление строк в таблицу для каждой сделки
	for (let i = 0; i < leadsData.length; i++) {
		const row = document.createElement('tr');

		// Заполнение строки данными о сделке
		const nameLead = document.createElement('td');
		nameLead.textContent = leadsData[i].name;
		row.appendChild(nameLead);

		const budgetCell = document.createElement('td');
		budgetCell.textContent = moneyMask(leadsData[i].price) + ' ₽';
		row.appendChild(budgetCell);

		const createdCell = document.createElement('td');
		createdCell.textContent = formattedTime(leadsData[i].created_at);
		row.appendChild(createdCell);

		const updatedCell = document.createElement('td');
		updatedCell.textContent = formattedTime(leadsData[i].updated_at);
		row.appendChild(updatedCell);

		const responsibleCell = document.createElement('td');
		responsibleCell.textContent = leadsData[i].responsible_user_id;
		row.appendChild(responsibleCell);

		// Добавление строки в таблицу
		tableBody.appendChild(row);
	}
};

// sort onClick by name
sortByNameBtn.addEventListener('click', () => {
	nameSort = !nameSort;
	const sortedName = sortLeadsByName(leads, nameSort);
	renderTable(sortedName);
});

// sort onClick by budget
sortByBudgetBtn.addEventListener('click', async () => {
	budgetSort = !budgetSort;
	const sortedBudget = sortLeadsByBudget(leads, budgetSort);
	renderTable(sortedBudget);
});

// Get leads method
export async function getLeads(access_token, page, limit) {
	try {
		const tbodyContainer = document.querySelector('.tbody-container');
		tbodyContainer.innerHTML = '';

		// hide current table rows
		const thead = document.querySelector('thead');
		thead.style.display = 'none';

		const existingRows = tableBody.querySelectorAll('tr');
		existingRows.forEach((row) => {
			row.style.display = 'none';
		});

		// add skeleton
		for (let i = 0; i < limit; i++) {
			const skeletonRow = document.createElement('div');
			skeletonRow.classList.add('skeleton-row');

			const skeletonItem = document.createElement('div');
			skeletonItem.classList.add('skeleton-item');

			skeletonRow.appendChild(skeletonItem);
			tbodyContainer.appendChild(skeletonRow);
		}

		const response = await fetch(
			`${CORS_DISABLE}${API_BASE_URL}${LEADS_URL}?page=${page}&limit=${limit}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${access_token}`,
					'Content-Type': 'application/json',
				},
			}
		);

		const data = await response.json();
		leads = data._embedded.leads;
		renderTable(leads);

		// redrawing the table after loading
		thead.style.display = '';
		tbodyContainer.innerHTML = '';

		const newRows = tableBody.querySelectorAll('tr');
		newRows.forEach((row) => {
			row.style.display = 'table-row';
		});
	} catch (e) {
		console.error('Error:', e);
	}
}
