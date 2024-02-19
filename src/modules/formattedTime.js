// formatting time
export default function unixTimestampToFormattedTime(unixTimestamp) {
	const date = new Date(unixTimestamp * 1000);

	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const seconds = date.getSeconds();

	const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	return formattedTime;
}
