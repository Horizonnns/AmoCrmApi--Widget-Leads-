// sort leads by budget
const sortLeadsByBudget = (leadsData, ascending) => {
	const sortedLeads = [...leadsData];

	sortedLeads.sort((a, b) => {
		const budgetA = a.price;
		const budgetB = b.price;

		return ascending ? budgetA - budgetB : budgetB - budgetA;
	});

	return sortedLeads;
};

// sort leads by name
const sortLeadsByName = (leadsData, ascending) => {
	const sortedLeadsName = [...leadsData];

	sortedLeadsName.sort((a, b) => {
		const nameA = a.name;
		const nameB = b.name;

		return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
	});

	return sortedLeadsName;
};

export { sortLeadsByBudget, sortLeadsByName };
