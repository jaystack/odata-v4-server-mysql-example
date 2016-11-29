function getObjectValues(object: any, objectKeys: any[]): any[] {
  return objectKeys.map(key => object[key]);
}

export default function getValuesForMultipleRowInsertion(collection: any[]): any[] {
  const valuesArray = collection.map(item => getObjectValues(item, Object.keys(item)));
  return valuesArray.reduce((prev, current) => prev.concat(current));
}