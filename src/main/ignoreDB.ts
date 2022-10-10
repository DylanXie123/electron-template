import Database from 'better-sqlite3';
import type { IgnoreData } from '../renderer/store/ignore';

const convertToDB = (item: IgnoreData) => {
  if (item.recursive) {
    return { ...item, recursive: 1 };
  } else {
    return { ...item, recursive: 0 };
  }
}

const convertFromDB = (item: any): IgnoreData => {
  if (item.recursive === 1) {
    return { ...item, recursive: true };
  } else {
    return { ...item, recursive: false };
  }
}

const db = new Database('Movie.sqlite');

const initDatabase = () => {
  return db.prepare(`
    CREATE TABLE IF NOT EXISTS Ignore (
      fullPath	TEXT NOT NULL UNIQUE,
      recursive	INTEGER NOT NULL,
      PRIMARY KEY("fullPath")
    )
  `).run();
}

const create = (item: IgnoreData) => {
  const insert = db.prepare(`
    INSERT INTO Ignore VALUES
    (@fullPath, @recursive)
  `);
  return insert.run(convertToDB(item));
}

const importDB = (path: string): IgnoreData[] => {
  const inputDB = new Database(path, { fileMustExist: true });
  const retrieve = inputDB.prepare('SELECT * FROM Ignore');
  const inputData = retrieve.all();
  const insert = db.prepare(`
    INSERT INTO Ignore VALUES
    (@fullPath, @recursive)
  `);
  const insertMany = db.transaction((values: any[]) =>
    values.map(item => insert.run(item))
  );
  insertMany(inputData);
  return inputData;
}

const update = (newData: IgnoreData) => {
  const updateItem = db.prepare(`UPDATE Ignore SET recursive = @recursive WHERE fullPath = @fullPath`);
  return updateItem.run(newData);
}

const retrieve = (fullPath: string) => {
  const selectItem = db.prepare(`SELECT * FROM Ignore WHERE fullPath = @fullPath`);
  return convertFromDB(selectItem.get({ fullPath: fullPath }));
}

const retrieveAll = () => {
  const retrieve = db.prepare(`SELECT * FROM Ignore`);
  const result = retrieve.all();
  return result.map(convertFromDB);
}

const deleteDB = (fullPath: string) => {
  const del = db.prepare(`DELETE FROM Ignore WHERE fullPath = @fullPath`);
  return del.run({ fullPath: fullPath });
}

const closeDB = () => {
  return db.close();
}

const IgnoreDB = {
  initDatabase,
  create,
  importDB,
  update,
  retrieve,
  retrieveAll,
  deleteDB,
  closeDB,
}

export default IgnoreDB;
