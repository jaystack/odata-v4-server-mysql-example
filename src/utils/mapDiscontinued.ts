export default function mapDiscontinued(results: any[]): any[] {
  return results.map(result => {
    if (!result.hasOwnProperty('Discontinued'))
      return result;
    result.Discontinued = (result.Discontinued == 1) ? true : false;
    return result;
  });
}