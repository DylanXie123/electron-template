import { action, computed, makeObservable, observable } from 'mobx';
import { parse } from 'path';
import React, { useContext } from 'react';
import {
  initIgnoreDB,
  getNodeDBIndex,
  validateNode,
} from './utils';
import type { IgnoreData } from './ignore';
import { MediaInfo, MovieInfo, TVInfo } from './media';
import FileTree from './fileTree';

const path = "D:/OneDrive - stu.xjtu.edu.cn/Media/Movies";

export default class FileTreeStore {
  constructor(fileTree: FileTree) {
    makeObservable(this);
    this.fileTree = fileTree;
    initIgnoreDB()
      .then(this.setIgnoreList)
      .then((ignoreList) => this.filterFileTree(this.fileTree, ignoreList))
      .then(this.appendMovieDB)
      .then(action((t) => this.fileTree = t));
  }

  @observable
  private ignoreList: IgnoreData[] = [];

  @observable
  private fileTree: FileTree;

  @observable
  private filterProp: FilterProp = {
    sort: Sort.Title,
    order: Order.Asc,
    queryStr: '',
    onlyOnDisk: false,
  };

  @observable
  private selectedList: FileTree[] = [];

  @observable
  private detailNode: FileTree | undefined;

  @action
  importIgnoreDB = async (path: string) => {
    const dbItems = window.ignoreDBAPI.importDB(path);
    this.ignoreList = this.ignoreList.concat(dbItems);
    this.fileTree = this.filterFileTree(this.fileTree, this.ignoreList);
  };

  @action
  importMovieDB = async (path: string) => {
    window.movieDBAPI.importDB(path);
    this.fileTree = await this.appendMovieDB(this.fileTree);
  };

  @action
  updateNode = (node: FileTree, newData: MediaInfo) =>
    this.fileTree.forEach((oldTree) => {
      const query = oldTree.query(node.fullPath);
      if (query) {
        query.media = newData;
        window.movieDBAPI.create(newData.convertToDB(getNodeDBIndex(query)));
      }
      return oldTree;
    });

  @action
  appendMovieDB = async (fileTree: FileTree) => {
    const movieDB = new Map(window.movieDBAPI.retrieveAll().map(item => [item.fileName, item]));
    fileTree.forEachWithStop(node => {
      const media = movieDB.get(getNodeDBIndex(node));
      if (media) {
        if (media.runtime) {
          node.media = MovieInfo.convertFromDB(media);
        } else if (media.seasons) {
          node.media = TVInfo.convertFromDB(media);
        }
      }
      return media === undefined;
    })
    return fileTree;
  }

  @action
  filterFileTree = (fileTree: FileTree, ignoreList: IgnoreData[]) => {
    ignoreList.forEach(ignore => {
      /**
       * to ignore a node, we need to get ref to its parent node,
       * then remove the node from its parent's children
       */
      const parsed = parse(ignore.fullPath);
      let parentTree = fileTree.query(parsed.dir);
      if (parentTree) parentTree.children?.delete(ignore.fullPath);
    });
    return fileTree;
  }

  @action
  addIgnore = (newIgnore: IgnoreData) => {
    this.ignoreList.push(newIgnore);
    this.fileTree = this.filterFileTree(this.fileTree, this.ignoreList);
    return window.ignoreDBAPI.create(newIgnore);
  };

  @action
  removeIgnore = async (removeIgnore: IgnoreData) => {
    this.ignoreList = this.ignoreList.filter(
      (ignore) => ignore.fullPath !== removeIgnore.fullPath
    );
    this.fileTree = this.filterFileTree(this.fileTree, this.ignoreList);
    this.fileTree = await this.appendMovieDB(this.fileTree);
    return window.ignoreDBAPI.deleteDB(removeIgnore.fullPath);
  };

  @action
  setFilterProp(prop: Partial<FilterProp>) {
    this.filterProp = { ...this.filterProp, ...prop };
  }

  @action
  setIgnoreList = (newData: IgnoreData[]) => {
    this.ignoreList = newData;
    return newData;
  };

  @computed get getFileTree() {
    return this.fileTree;
  }

  @computed get getIgnoreList() {
    return this.ignoreList;
  }

  @computed get getSelected() {
    return this.detailNode;
  }

  @computed get getFilterProp() {
    return this.filterProp;
  }

  flatTree(tree: FileTree) {
    const nodes: FileTree[] = [];
    tree.forEachWithStop((node) => {
      if (node.media) {
        nodes.push(node);
        return false;
      }
      if (!node.isLeaf) {
        const children = Array.from(node.children!.values());
        const validChildren = children.filter(validateNode);
        if (validChildren.length === 1) {
          nodes.push(node);
          return false;
        }
      }
      if (node.isLeaf && validateNode(node)) {
        nodes.push(node);
        return false;
      }
      return true;
    });
    return nodes;
  }

  @computed get getGridFileTree() {
    return recalcNodes(this.flatTree(this.getFileTree), this.filterProp);
  }

  @action
  showDetail = (node: FileTree) => {
    this.detailNode = node;
  };

  @action
  select = (node: FileTree) => {
    const parsed = parse(node.fullPath);
    const parentIndex = this.selectedList.findIndex(
      (item) => item.fullPath === parsed.dir
    );
    if (parentIndex > -1) {
      const newList = this.selectedList.slice(0, parentIndex + 1);
      newList.push(node);
      this.detailNode = node;
      this.selectedList = newList;
    }
  }

  @computed get getColumnFileTree() {
    const filtered = this.selectedList.filter((node) => !node.isLeaf);
    const expanded = filtered.map((node) =>
      Array.from(node.children!.values())
    );
    expanded[0] = recalcNodes(expanded[0], this.filterProp);
    return expanded;
  }
}

export const FileTreeStoreContext = React.createContext<FileTreeStore | null>(
  null
);

export const useFileTreeStore = () => {
  const fileTreeStore = useContext(FileTreeStoreContext);
  if (fileTreeStore === null) {
    throw new Error(
      'useFileTreeStore must be used within a FileTreeStoreContext.'
    );
  } else {
    return fileTreeStore;
  }
};

export enum Sort {
  Random = 'Random',
  Title = 'Title',
  ReleaseDate = 'Release Date',
  TMDBRating = 'TMDB Rating',
}

export enum Order {
  Asc = 'Ascending',
  Desc = 'Descending',
}

const shuffle = <T>(array: T[]) => {
  let currentIndex = array.length;
  let randomIndex: number;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

const resort = (nodes: FileTree[], newSort: Sort, newOrder: Order) => {
  const compareTitle = (a: FileTree, b: FileTree) => {
    if (a.media === undefined || b.media === undefined) {
      return 0;
    }
    if (a.media.title < b.media.title) {
      return newOrder === Order.Asc ? -1 : 1;
    }
    if (a.media.title > b.media.title) {
      return newOrder === Order.Asc ? 1 : -1;
    }
    return 0;
  };

  const compareDate = (a: FileTree, b: FileTree) => {
    if (a.media === undefined || b.media === undefined) {
      return 0;
    }
    if (newOrder === Order.Asc) {
      return a.media.releaseDate.getTime() - b.media.releaseDate.getTime();
    }
    return b.media.releaseDate.getTime() - a.media.releaseDate.getTime();
  };

  const compareRating = (a: FileTree, b: FileTree) => {
    if (a.media === undefined || b.media === undefined) {
      return 0;
    }
    if (newOrder === Order.Asc) {
      return a.media.tmdbRating - b.media.tmdbRating;
    }
    return b.media.tmdbRating - a.media.tmdbRating;
  };

  switch (newSort) {
    case Sort.Random:
      return shuffle(nodes);
    case Sort.Title:
      return nodes.sort(compareTitle);
    case Sort.ReleaseDate:
      return nodes.sort(compareDate);
    case Sort.TMDBRating:
      return nodes.sort(compareRating);
    default:
      throw Error('unimplemented error');
  }
};

const queryNodes = (nodes: FileTree[], queryStr: string) =>
  nodes.filter(
    (node) =>
      node.fullPath.toLowerCase().includes(queryStr.toLowerCase()) ||
      node.media?.title.toLowerCase().includes(queryStr.toLowerCase())
  );

const filterOnDisk = (nodes: FileTree[], onlyOnDisk: boolean) => {
  if (onlyOnDisk) {
    return nodes.filter((node) => node.onDisk);
  }
  return nodes;
};

export interface FilterProp {
  sort: Sort;
  order: Order;
  queryStr: string;
  onlyOnDisk: boolean;
}

export const recalcNodes = (originalNode: FileTree[], prop: FilterProp) => {
  let newNodes = filterOnDisk(originalNode, prop.onlyOnDisk);
  newNodes = queryNodes(newNodes, prop.queryStr);
  return resort(newNodes, prop.sort, prop.order);
};
