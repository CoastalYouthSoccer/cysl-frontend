export function formatDateToYYYYMMDD(date) {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, '0'); // getMonth is zero-based
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${yyyy}-${mm}-${dd}`;
}
