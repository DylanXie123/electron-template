export default class IMDBAPI {
  static baseURL = "https://imdb-api.com";
  static apiKey = window.apiKey.IMDB;

  /**
   * may return empty array
   * throws error if sth goes wrong
   */
  static searchTitle = async (name: string): Promise<string[]> => {
    const url = new URL(`API/Search/${this.apiKey}/${name}`, this.baseURL);
    const response = await fetch(url.href);
    const json = await response.json();
    if (json && json.results) {
      if (json.results.length) {
        return json.results.map((result: any) => result.id);
      } else {
        return [];
      }
    } else {
      throw new Error(`IMDBAPI.searchTitle: ${json}`);
    }
  }
}
