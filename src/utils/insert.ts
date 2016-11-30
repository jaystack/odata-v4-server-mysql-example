function getParameters(tableName: string): string {
  return (tableName == 'Products') ? '(?,?,?,?,?,?)' : '(?,?,?)';
}

function getObjectValues(tableName: string, data: any): any[] {
  return (tableName == 'Products') ? [data.Id, data.QuantityPerUnit, data.UnitPrice, data.CategoryId, data.Name, data.Discontinued] : [data.Id, data.Description, data.Name];
}

export default async function insert(db: any, tableName: string, data: any) {
  const result = await db.query(`INSERT INTO ${tableName} VALUES ${getParameters(tableName)};`, getObjectValues(tableName, data));
  return Object.assign({}, data, { Id: result.insertId });
}