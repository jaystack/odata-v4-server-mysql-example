function getPatchQueryParameters(additionalValue: number, delta: any): any[] {
  const values = Object.keys(delta).map(key => delta[key]);
  return [...values, additionalValue];
}

function getUpdateParameters(deltaKeys: string[]): string {
  return deltaKeys.map(key => key + '=?').join();
}

function getPatchQueryString(tableName: string, delta: any): string {
  const deltaKeys = Object.keys(delta);
  return `UPDATE ${tableName} SET ${getUpdateParameters(deltaKeys)} WHERE Id = ?`;
}

export default async function update(db: any, delta: any, key: number, tableName: string) {
  return await db.query(getPatchQueryString(tableName, delta), getPatchQueryParameters(key, delta));
}