export default function getPatchQueryParameters(additionalValue: number, delta: any): any[] {
  const values = Object.keys(delta).map(key => delta[key]);
  return [...values, additionalValue];
}