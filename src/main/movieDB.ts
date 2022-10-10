import Database from 'better-sqlite3';
import type { MediaInfo } from '../renderer/store/media';

export type MediaDBData = Omit<MediaInfo, "getPosterURL" | "getBackgroundURL" | "convertToDB" | "releaseDate" | "genres" | "credits"> & {
  fileName: string,
  releaseDate: string,
  genres: string,
  credits: string,
  runtime?: number,
  seasons?: string,
};

const connectToDatabase = () => new Database('Movie.sqlite');

const db = connectToDatabase();

const initDatabase = () => {
  return db.prepare(`
    CREATE TABLE IF NOT EXISTS Movie (
      fileName	TEXT NOT NULL UNIQUE,
      title	TEXT NOT NULL,
      tmdbID	INTEGER NOT NULL,
      imdbID	INTEGER,
      posterURL	TEXT,
      backgroundURL	TEXT,
      overview	TEXT,
      language	TEXT NOT NULL,
      releaseDate	TEXT NOT NULL,
      tmdbRating	NUMERIC NOT NULL,
      imdbRating	NUMERIC,
      runtime NUMERIC,
      genres	TEXT NOT NULL,
      credits	TEXT NOT NULL,
      seasons	TEXT,
      PRIMARY KEY("fileName")
    )
  `).run();
}

const importDB = (path: string) => {
  const inputDB = new Database(path, { fileMustExist: true });
  const retrieve = inputDB.prepare(`SELECT * FROM Movie`);
  const inputData = retrieve.all() as MediaDBData[];
  const insert = db.prepare(`
    INSERT OR REPLACE INTO Movie VALUES
    (@fileName, @title, @tmdbID, @imdbID, @posterURL, @backgroundURL,
      @overview, @language, @releaseDate, @tmdbRating, @imdbRating,
      @runtime, @genres, @credits, @seasons)
  `);
  const insertMany = db.transaction((values: any[]) =>
    values.map(item => insert.run(item))
  );
  insertMany(inputData);
  return inputData;
}

/**
 * use create to replace create and update
 * use `INSERT OR REPLACE` SQL
 */
const create = (item: MediaDBData) => {
  const insert = db.prepare(`
    INSERT OR REPLACE INTO Movie VALUES
    (@fileName, @title, @tmdbID, @imdbID, @posterURL, @backgroundURL,
      @overview, @language, @releaseDate, @tmdbRating, @imdbRating,
      @runtime, @genres, @credits, @seasons)
  `);
  return insert.run(item);
}

const retrieve = (fileNames: string[]) => {
  const rtv = db.prepare(`SELECT * FROM Movie WHERE fileName = @fileName`);
  const retrieveMany = db.transaction(
    (names: string[]) => names.map(n => rtv.get({ fileName: n }))
  );
  return retrieveMany(fileNames) as (MediaDBData | undefined)[];
}

const retrieveAll = () => {
  const retrieve = db.prepare(`SELECT * FROM Movie`);
  return retrieve.all() as MediaDBData[];
}

const deleteDB = (fileName: string) => {
  const del = db.prepare(`DELETE FROM Movie WHERE fileName = @fileName`);
  return del.run({ fileName });
}

const closeDB = () => {
  return db.close();
}

const MovieDB = {
  initDatabase,
  importDB,
  create,
  retrieve,
  retrieveAll,
  deleteDB,
  closeDB,
}

export default MovieDB;
