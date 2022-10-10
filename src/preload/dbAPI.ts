import Store from 'electron-store';
import IgnoreDB from '../main/ignoreDB';
import MovieDB from '../main/movieDB';

const movieDBAPI = MovieDB;

const ignoreDBAPI = IgnoreDB;

type StoreType = {
  index: string;
  content: any;
}

const store = new Store<StoreType>();

const storageAPI = {
  get: (index: string) => store.get(index),
  set: (index: string, content: any) => store.set(index, content),
}

export { movieDBAPI, ignoreDBAPI, storageAPI };
