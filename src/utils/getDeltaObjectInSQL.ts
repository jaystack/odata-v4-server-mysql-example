export default function getDeltaObjectInSQL(delta: any): string {
  const deltaKeys = Object.keys(delta);
  if (deltaKeys.length == 1) return `${deltaKeys[0]}=${delta[deltaKeys[0]]}`;
  return deltaKeys.reduce((prev, current) => `${prev}=${delta[prev]}, ${current}=${delta[current]}`);
}