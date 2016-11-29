function getObjectValues(delta: any, deltaKeys: any[]): any[] {
  return deltaKeys.map(key => delta[key]);
}

export default function getPatchQueryParameters(key: number, delta: any): any[] {
  const dataKeys = Object.keys(delta);
  const dataValues = getObjectValues(delta, dataKeys);
  return [...dataValues, key];
}