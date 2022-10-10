import { CastInfo, MediaInfo, MovieInfo, SeasonInfo, TVInfo } from "../store/media";
import IMDBAPI from "./IMDB";

/**
 * In API request, bad internet connection will throw an error.
 */
export default class TMDBAPI {
  static baseURL = "https://api.themoviedb.org/";

  static parseCast = (casts: any) => {
    return casts.map((c: any) => {
      return new CastInfo({
        id: c.id,
        name: c.name,
        department: c.department,
        gender: c.gender,
        profile: c.profile_path,
        credit_id: c.credit_id,
      });
    });
  }

  /**
   * undefined if not found
   */
  static movies = async (movie_id: string): Promise<MovieInfo | undefined> => {
    const url = new URL(`3/movie/${movie_id}`, this.baseURL);
    url.searchParams.append('append_to_response', 'credits');
    const response = await authFetch(url);
    const json = await response.json();

    if (json && json.id) {
      const imdbID = json.imdb_id ? parseInt(json.imdb_id.slice(2)) : undefined;
      return new MovieInfo({
        title: json.title,
        tmdbID: json.id,
        imdbID: imdbID,
        posterURL: json.poster_path,
        backgroundURL: json.backdrop_path,
        overview: json.overview,
        language: json.original_language,
        releaseDate: json.release_date,
        tmdbRating: json.vote_average,
        runtime: json.runtime,
        genres: json.genres.map((g: any) => g.name),
        credits: this.parseCast(json.credits.cast),
      });
    } else {
      return undefined;
    }
  }

  /**
   * undefined if not found
   */
  static tvs = async (tv_id: string): Promise<TVInfo | undefined> => {
    const url = new URL(`3/tv/${tv_id}`, this.baseURL);
    url.searchParams.append('append_to_response', 'credits,external_ids');
    const response = await authFetch(url);
    const json = await response.json();

    const parseSeason = (seasons: any) => {
      return seasons.map((s: any) => {
        return new SeasonInfo({
          air_date: s.air_date,
          episode_count: s.episode_count,
          tmdbID: s.id,
          name: s.name,
          overview: s.overview,
          poster_path: s.poster_path,
          season_number: s.season_number,
        })
      })
    }

    if (json && json.id) {
      const imdbID = json?.external_ids?.imdb_id ? parseInt(json.external_ids.imdb_id.slice(2)) : undefined;
      return new TVInfo({
        title: json.name,
        tmdbID: json.id,
        imdbID: imdbID,
        posterURL: json.poster_path,
        backgroundURL: json.backdrop_path,
        overview: json.overview,
        language: json.original_language,
        releaseDate: json.first_air_date,
        tmdbRating: json.vote_average,
        genres: json.genres.map((g: any) => g.name),
        credits: this.parseCast(json.credits.cast),
        seasons: parseSeason(json.seasons),
      });
    } else {
      return undefined;
    }
  }

  /**
   * undefined if not found
   */
  static findMovie = async (external_id: string): Promise<MovieInfo | undefined> => {
    const url = new URL(`3/find/${external_id}`, this.baseURL);
    url.searchParams.append('external_source', 'imdb_id');
    const response = await authFetch(url);
    const json = await response.json();
    if (json && json.movie_results && json.movie_results.length) {
      const elm = json.movie_results[0];
      const tmdbID = elm.id;
      return await TMDBAPI.movies(tmdbID);
    } else {
      return undefined;
    }
  }

  /**
   * may return empty array
   * throws error if sth goes wrong
   */
  static searchMovie = async (movieName: string): Promise<MovieInfo[]> => {
    const url = new URL('3/search/movie', this.baseURL);
    url.searchParams.append('query', movieName);
    const response = await authFetch(url);
    const json = await response.json();
    if (json && json.results) {
      const ids = json.results.map((elm: any) => elm.id) as string[];
      const results = await Promise.all(ids.map(id => this.movies(id)));
      return results.filter(elm => elm !== undefined) as MovieInfo[];
    } else {
      throw new Error(`TMDBAPI.searchMovie: ${json}`);
    }
  }

  /**
   * may return empty array
   * throws error if sth goes wrong
   */
  static searchTV = async (tvName: string): Promise<TVInfo[]> => {
    const url = new URL('3/search/tv', this.baseURL);
    url.searchParams.append('query', tvName);
    const response = await authFetch(url);
    const json = await response.json();
    if (json && json.results) {
      const ids = json.results.map((elm: any) => elm.id) as string[];
      const results = await Promise.all(ids.map(id => this.tvs(id)));
      return results.filter(elm => elm !== undefined) as TVInfo[];
    } else {
      throw new Error(`TMDBAPI.searchTV: ${json}`);
    }
  }

  /**
   * may return empty array
   * throws error if sth goes wrong
   */
  static searchMulti = async (query: string): Promise<MediaInfo[]> => {
    const url = new URL('3/search/multi', this.baseURL);
    url.searchParams.append('query', query);
    const response = await authFetch(url);
    const json = await response.json();
    if (json && json.results) {
      let movies: string[] = [];
      let tvs: string[] = [];
      json.results.forEach((elm: any) => {
        if (elm.media_type === 'movie') movies.push(elm.id);
        else if (elm.media_type === 'tv') tvs.push(elm.id);
      });
      const movieResults = await Promise.all(movies.map(id => this.movies(id)));
      const tvResults = await Promise.all(tvs.map(id => this.tvs(id)));
      return movieResults.concat(tvResults).filter(elm => elm !== undefined) as MediaInfo[];
    } else {
      throw new Error(`TMDBAPI.searchMulti: ${json}`);
    }
  }

  /**
   * may return empty array
   * throws error if sth goes wrong
   */
  static useIMDBSearch = async (movieName: string): Promise<MovieInfo[]> => {
    const results = await IMDBAPI.searchTitle(movieName);
    const movies = await Promise.all(results.map(id => this.findMovie(id)));
    return movies.filter(movie => movie !== undefined) as MovieInfo[];
  }
}

const authFetch = (url: URL) => {
  const api_key = window.apiKey.TMDB;
  url.searchParams.append('api_key', api_key);
  return fetch(url.href);
}
