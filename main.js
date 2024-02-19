// Import our custom CSS
import './src/assets/scss/styles.scss';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap';

import { getTokens } from './src/modules/getTokens';
import { getLeads } from './src/modules/getLeads';

const access_token = localStorage.getItem('access_token');
const selectedValue = localStorage.getItem('selectedValue');

const runApp = () => {
	if (access_token === 'undefined' || access_token === null) {
		window.onload = getTokens();
	} else if (access_token !== 'undefined' && access_token !== null) {
		if (selectedValue) {
			window.onload = getLeads(access_token, 1, selectedValue);
		} else {
			window.onload = getLeads(access_token, 1, 5);
		}

		// pagination queries
		const paginBtns = [
			{ class: 'showTwoLeadsBtn', page: 1, limit: 2 },
			{ class: 'showFiveLeadsBtn', page: 1, limit: 5 },
			{ class: 'showTenLeadsBtn', page: 1, limit: 10 },
			{ class: 'showAllLeadsBtn', page: 1, limit: 'undefined' },
		];

		// pagination click events
		for (let i = 0; i < paginBtns.length; i++) {
			document
				.querySelector(`.${paginBtns[i].class}`)
				.addEventListener('click', async () => {
					setTimeout(async () => {
						await getLeads(access_token, paginBtns[i].page, paginBtns[i].limit);
					}, 500);
				});
		}
	}
};

runApp();
