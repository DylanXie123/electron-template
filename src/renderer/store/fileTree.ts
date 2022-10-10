import { makeObservable, observable } from 'mobx';
import { parse, ParsedPath, join } from 'path';
import type { MediaInfo } from './media';

interface FileNodeProp {
  fullPath: string;
  blocks: number;
  blksize: number;
  size: number;
  media?: MediaInfo;
}

class FileNode {
  constructor(prop: FileNodeProp) {
    this.fullPath = prop.fullPath;
    this.parsed = parse(this.fullPath);
    this.blocks = prop.blocks;
    this.blksize = prop.blksize;
    this.size = prop.size;
    this.media = prop.media;
  }

  fullPath: string;
  parsed: ParsedPath;
  blocks: number;
  blksize: number;
  size: number;
  media?: MediaInfo;

  get onDisk() {
    return !(this.blocks === 0);
  }

  get diskSize() {
    return this.blocks * this.blksize;
  }
}

export default class FileTree extends FileNode {

  constructor(root: FileNodeProp, children?: FileTree[]) {
    super(root);
    makeObservable(this);
    if (children && children.length > 0) {
      this.children = new Map<string, FileTree>();
      children.forEach(child => this.children!.set(child.fullPath, child));
    }
  }

  name: string | undefined;

  @observable
  children?: Map<string, FileTree>;

  query(path: string): FileTree | undefined {
    if (path.includes(this.fullPath)) {
      const subPath = path.replace(this.fullPath, '');
      const indexList = subPath.slice(1).split('/').filter(Boolean);

      let parent: FileTree | undefined = this;
      let result: FileTree | undefined = this;
      let queryStr = this.fullPath;

      for (let index = 0; index < indexList.length; index++) {
        parent = result;
        queryStr = join(queryStr, indexList[index]);
        if (parent && !parent.isLeaf) {
          result = parent.children!.get(queryStr);
        } else {
          return undefined;
        }
      }
      return result;
    } else {
      return undefined;
    }
  }

  forEach(callback: (node: FileTree) => void) {
    callback(this);
    if (!this.isLeaf) this.children!.forEach(child => child.forEach(callback));
  }

  map<T>(callback: (node: FileTree) => T): T[] {
    const result: T[] = [];
    result.push(callback(this));
    if (this.children) {
      this.children.forEach(child => result.push(...child.map(callback)));
    }
    return result;
  }

  /**
   * stop traversing when the callback returns false
   * @param predict return `true` to go deeper in the tree
   */
  forEachWithStop(predict: (node: FileTree) => boolean) {
    const result = predict(this);
    if (result && !this.isLeaf) {
      this.children!.forEach(child => child.forEachWithStop(predict));
    }
  }

  get flatToList() {
    const result: FileNode[] = [];
    this.forEach(node => result.push(node));
    return result;
  }


  get isLeaf() {
    return this.children === undefined || this.children.size === 0;
  }
}
