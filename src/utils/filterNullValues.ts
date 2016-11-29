function filterRow(item) {
  const newItem = {};
  Object.keys(item)
    .filter(key => item[key] !== null)
    .forEach(key => newItem[key] = item[key]);
  return newItem;
}

export default function filterNullValues(rows: any[]): any[] {
  return rows.map(row => filterRow(row));
}