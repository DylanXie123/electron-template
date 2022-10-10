import type { MediaDBData } from '../../main/movieDB';

interface MediaInfoProp {
  title: string;
  tmdbID: number;
  imdbID?: number;
  posterURL?: string;
  backgroundURL?: string;
  overview?: string;
  language: string;
  releaseDate: string;
  tmdbRating: number;
  imdbRating?: number;
  genres: string[];
  credits: CastInfo[];
}

export class MediaInfo {
  constructor(prop: MediaInfoProp) {
    this.title = prop.title;
    this.tmdbID = prop.tmdbID;
    this.imdbID = prop.imdbID;
    this.posterURL = prop.posterURL;
    this.backgroundURL = prop.backgroundURL;
    this.overview = prop.overview;
    this.language = prop.language;
    this.releaseDate = new Date(prop.releaseDate);
    this.tmdbRating = prop.tmdbRating;
    this.imdbRating = prop.imdbRating;
    this.genres = prop.genres;
    this.credits = prop.credits;
  }

  title: string;
  tmdbID: number;
  imdbID?: number;
  posterURL?: string;
  backgroundURL?: string;
  overview?: string;
  language: string;
  releaseDate: Date;
  tmdbRating: number;
  imdbRating?: number;
  genres: string[];
  credits: CastInfo[];

  /**
   * image's intrinsic width in pixels:
   * "w92",
   * "w154",
   * "w185",
   * "w342",
   * "w500",
   * "w780",
   * "original"
   */
  getPosterURL(resolution: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w185") {
    if (this.posterURL) {
      return `https://image.tmdb.org/t/p/${resolution}${this.posterURL}`;
    } else {
      return undefined
    }
  }

  /**
   * image's intrinsic width in pixels:
   * "w300",
   * "w780",
   * "w1280",
   * "original"
   */
  getBackgroundURL(resolution: "w300" | "w780" | "w1280" | "original" = "w780") {
    if (this.backgroundURL) {
      return `https://image.tmdb.org/t/p/${resolution}${this.backgroundURL}`;
    } else {
      return undefined;
    }
  }

  convertToDB(fileName: string): MediaDBData {
    return {
      fileName: fileName,
      title: this.title,
      tmdbID: this.tmdbID,
      imdbID: this.imdbID,
      posterURL: this.posterURL,
      backgroundURL: this.backgroundURL,
      overview: this.overview,
      language: this.language,
      releaseDate: this.releaseDate.toDateString(),
      tmdbRating: this.tmdbRating,
      imdbRating: this.imdbRating,
      genres: JSON.stringify(this.genres),
      credits: JSON.stringify(this.credits),
      runtime: undefined,
      seasons: undefined,
    }
  }
}

export class MovieInfo extends MediaInfo {
  constructor(prop: MediaInfoProp & { credits: CastInfo[], runtime?: number }) {
    super(prop);
    this.runtime = prop.runtime;
  }

  static convertFromDB(data: MediaDBData): MovieInfo {
    const { fileName, ...rest } = data;
    return new MovieInfo({
      ...rest,
      genres: JSON.parse(rest.genres),
      credits: JSON.parse(rest.credits).map((c: any) => new CastInfo(c)),
      runtime: data.runtime,
    });
  }

  runtime?: number;

  convertToDB(fileName: string): MediaDBData {
    const data = super.convertToDB(fileName);
    return {
      ...data,
      runtime: this.runtime,
    }
  }
}

export class TVInfo extends MediaInfo {
  constructor(prop: MediaInfoProp & { seasons: SeasonInfo[] }) {
    super(prop);
    this.seasons = prop.seasons;
  }

  static convertFromDB(data: MediaDBData): TVInfo {
    const { fileName, ...rest } = data;
    return new TVInfo({
      ...rest,
      genres: JSON.parse(rest.genres),
      credits: JSON.parse(rest.credits).map((c: any) => new CastInfo(c)),
      seasons: JSON.parse(rest.seasons!).map((s: any) => new SeasonInfo(s)),
    });
  }

  seasons: SeasonInfo[];

  convertToDB(fileName: string): MediaDBData {
    const data = super.convertToDB(fileName);
    return {
      ...data,
      seasons: JSON.stringify(this.seasons),
    }
  }
}

export class SeasonInfo {
  constructor(prop: {
    air_date: string;
    episode_count: number;
    tmdbID: number;
    name: string;
    overview: string;
    poster_path?: string;
    season_number: number;
  }) {
    this.air_date = new Date(prop.air_date);
    this.episode_count = prop.episode_count;
    this.tmdbID = prop.tmdbID;
    this.name = prop.name;
    this.overview = prop.overview;
    this.poster_path = prop.poster_path;
    this.season_number = prop.season_number;
  }

  air_date: Date;
  episode_count: number;
  tmdbID: number;
  name: string;
  overview: string;
  poster_path?: string;
  season_number: number;

  /**
   * image's intrinsic width in pixels:
   * "w92",
   * "w154",
   * "w185",
   * "w342",
   * "w500",
   * "w780",
   * "original"
   */
  getPosterURL(resolution: "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "original" = "w185") {
    return this.poster_path ? `https://image.tmdb.org/t/p/${resolution}${this.poster_path}` : undefined;
  }
}

export class CastInfo {

  constructor(prop: {
    id: number;
    name: string;
    department: string;
    gender?: number;
    profile?: string;
    credit_id: string;
  }) {
    this.id = prop.id;
    this.name = prop.name;
    this.department = prop.department;
    this.gender = prop.gender;
    this.profile = prop.profile;
    this.credit_id = prop.credit_id;
  }

  id: number;
  name: string;
  department: string;
  gender?: number;
  profile?: string;
  credit_id: string;

  /**
   * image's intrinsic width in pixels:
   * "w45",
   * "w185",
   * "h632",
   * "original"
   */
  getProfileURL(resolution: "w45" | "w185" | "h632" | "original" = "w185") {
    return this.profile ? `https://image.tmdb.org/t/p/${resolution}${this.profile}` : undefined;
  }

}

