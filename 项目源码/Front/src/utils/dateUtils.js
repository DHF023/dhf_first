export function formatDateToRFC1123(dateString) {
  const date = new Date(dateString);
  const options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  };
  const formattedDate = date.toLocaleString('en-US', options).replace(',', '');
  return formattedDate + ' GMT';
}