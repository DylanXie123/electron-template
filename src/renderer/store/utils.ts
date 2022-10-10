import { join } from 'path';
import TMDBAPI from "../api/TMDB";
import FileTree from './fileTree';

export const readLeafFileTree = (path: string) => {
  const stat = window.fsAPI.statSync(path);
  const newNode = new FileTree({
    fullPath: path,
    blocks: stat.blocks,
    blksize: stat.blksize,
    size: stat.size,
  });
  return newNode;
}

/**
 * use try catch to handle file permission
 * https://nodejs.org/api/fs.html#fsaccesspath-mode-callback
 */
export const readFileTree = (path: string): FileTree | undefined => {
  try {
    const rootNode = readLeafFileTree(path);
    if (window.fsAPI.statSync(path).isDirectory) {
      const dirs = window.fsAPI.readDir(path);
      // file was joined in posix path here
      const children = dirs.map(dir => readFileTree(join(path, dir.name)));
      const valid = children.filter(child => child !== undefined) as FileTree[];
      return new FileTree(rootNode, valid);
    } else {
      return new FileTree(rootNode);
    }
  } catch (error) {
    return undefined;
  }
}

export const validateNode = (fileNode: FileTree) => {
  const format = new RegExp("^\.(mp4|mkv|avi|rmvb|webm|flv)$");
  return format.test(fileNode.parsed.ext);
}

export const appendMovieAPI = async (fileTree: FileTree) => {
  await Promise.all(fileTree.map(async node => {
    if (!node.media) {
      const movieInfo = await TMDBAPI.searchMovie(node.parsed.name);
      if (movieInfo && movieInfo.length) {
        node.media = movieInfo[0];
        window.movieDBAPI.create(movieInfo[0].convertToDB(node.parsed.name));
      }
    }
  }));
  return fileTree;
}

/**
 * in folder node, `Harry.Potter.and.the.Goblet.of.Fire.2005.1080p.BluRay.x265-RARBG` folder
 * will be parsed as `(Harry.Potter.and.the.Goblet.of.Fire.2005.1080p.BluRay).x265-RARBG` file
 * so, use `parsed.base` to search db
 */
export const getNodeDBIndex = (node: FileTree) => node.isLeaf ? node.parsed.name : node.parsed.base;

export const initIgnoreDB = async () => window.ignoreDBAPI.retrieveAll();

export const getDateString = (date: Date | undefined) => {
  if (date === undefined) {
    return "";
  } else {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
  }
};
