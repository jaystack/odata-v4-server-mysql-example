function getObjectValues(object: any): any[] {
  return Object.keys(object).map(key => object[key]);
}

function getValuesForMultipleRowInsertion(collection: any[]): any[] {
  const valuesArray = collection.map(item => getObjectValues(item));
  return valuesArray.reduce((prev, current) => prev.concat(current));
}

function getParameterStringForMultipleRowInsertion(collection: any[]): string {
  const itemKeys = Object.keys(collection[0]);
  const rowString = '(' + itemKeys.map(key => '?').join() + ')';
  return collection.map(item => rowString).join();
}

export default async function multipleInsert(db: any, tableName: string, collection: any[]) {
  return await db.query(`INSERT INTO ${tableName} VALUES ${getParameterStringForMultipleRowInsertion(collection)};`, getValuesForMultipleRowInsertion(collection));
}