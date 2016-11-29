function getUpdateParameters(deltaKeys: string[]): string {
  return deltaKeys.map(key => key + '=?').join();
}

export default function getPatchQueryString(tableName: string, delta: any): string {
  const deltaKeys = Object.keys(delta);
  return `UPDATE ${tableName} SET ${getUpdateParameters(deltaKeys)} WHERE Id = ?`;
}

