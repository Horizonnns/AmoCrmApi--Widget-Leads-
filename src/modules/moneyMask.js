// convert numbs to money format
export default function moneyMask(number) {
	const numberString = number.toString();

	const groups = [];
	let currentGroup = '';
	for (let i = numberString.length - 1; i >= 0; i--) {
		currentGroup = numberString[i] + currentGroup;
		if (currentGroup.length === 3 || i === 0) {
			groups.unshift(currentGroup);
			currentGroup = '';
		}
	}

	return groups.join(' ');
}
