export default function getParameterStringForMultipleRowInsertion(collection: any[]): string {
  const itemKeys = Object.keys(collection[0]);
  const rowString = '(' + itemKeys.map(key => '?').join() + ')';
  return collection.map(item => rowString).join();
}