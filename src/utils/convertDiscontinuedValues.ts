export default function (results: any[]): any[] {
  return results.map(result => {
    if (!result.hasOwnProperty('Discontinued'))
      return result;
    return Object.assign({}, result, {Discontinued: result.Discontinued == 1});
  });
}