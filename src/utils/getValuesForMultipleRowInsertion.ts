function getObjectValues(object: any): any[] {
  return Object.keys(object).map(key => object[key]);
}

export default function getValuesForMultipleRowInsertion(collection: any[]): any[] {
  const valuesArray = collection.map(item => getObjectValues(item));
  return valuesArray.reduce((prev, current) => prev.concat(current));
}