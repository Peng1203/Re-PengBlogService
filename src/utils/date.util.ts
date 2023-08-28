import day from 'dayjs';

export function formatDate(data?: number | string | Date): string {
  if (data) day(data).format('YYYY-MM-DD HH:mm:ss');
  else return day().format('YYYY-MM-DD HH:mm:ss');
}

export default day;
