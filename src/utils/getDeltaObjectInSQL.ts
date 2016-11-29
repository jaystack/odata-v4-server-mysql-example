export default function getDeltaObjectInSQL(delta: any): string {
  return Object.keys(delta)
          .map(key => `${key}=${delta[key]}`)
          .join();
}