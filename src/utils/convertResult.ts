function filterRow(item) {
  const newItem = {};
  Object.keys(item)
    .filter(key => item[key] !== null)
    .forEach(key => newItem[key] = item[key]);
  return newItem;
}

function filterNullValues(rows: any[]): any[] {
  return rows.map(row => filterRow(row));
}

function convertDiscontinuedValues(results: any[]): any[] {
  return results.map(result => {
    if (!result.hasOwnProperty('Discontinued'))
      return result;
    return Object.assign({}, result, { Discontinued: result.Discontinued == 1 });
  });
}

export default function convertResult(results: any[]) {
  return convertDiscontinuedValues(filterNullValues(results));
}