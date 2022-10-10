import React from "react";
import TMDBAPI from "renderer/api/TMDB";
import FileTree from "renderer/store/fileTree";
import { useFileTreeStore } from "renderer/store/FileTreeStore";
import { getDateString } from "renderer/store/utils";
import { MediaInfo } from "renderer/store/media";
import HolderImage from "./HolderImage";

enum Status {
  Init,
  Loading,
  Complete,
  Error,
}

const Search = (props: { node: FileTree }) => {
  let status = Status.Init;
  let query = props.node.parsed.name;
  let results: MediaInfo[] = [];

  const search = () => {
    status = Status.Loading;
    TMDBAPI.searchMulti(query)
      .then((res) => {
        results = res;
        status = Status.Complete;
      })
      .catch(() => (status = Status.Error));
  };

  const clear = () => {
    results = [];
  };

  const updateStore = (node: FileTree, newData: MediaInfo) => {
    const store = useFileTreeStore();
    store.updateNode(node, newData);
    clear();
    status = Status.Init;
  };

  const clickOutside = (node: HTMLElement) => {
    const handleClick = (event: any) => {
      if (!node.contains(event.target)) {
        status = Status.Init;
        clear();
      }
    };

    document.addEventListener("click", handleClick, true);

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      },
    };
  };

  const renderStatus = () => {
    switch (status) {
      case Status.Error:
        return <li className="list-group-item">Error...</li>;
      case Status.Loading:
        return <li className="list-group-item">Error...</li>;
      case Status.Complete:
        if (results.length === 0) {
          return <li className="list-group-item">Error...</li>;
        } else {
          return results.map(movie =>
            <SearchItem key={movie.tmdbID} movie={movie} onClick={() => updateStore(props.node, movie)} />
          );
        }
      default:
        break;
    }
  }

  return (
    <div>
      <form onSubmit={search}>
        <div className="position-relative">
          <input
            className="form-control rounded-pill my-2"
            placeholder="Search"
            type="search"
            value={props.node.parsed.base}
            onInput={(e) => (query = e.currentTarget.value)}
          />
          <div className="position-absolute top-50 end-0 translate-middle">
            <div className="spinner-border spinner-grow-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </form>

      <div className="position-relative">
        <div className="position-absolute w-100" style={{ zIndex: 1 }}>
          <ul className="list-group">
            {renderStatus()}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Search

const SearchItem = (props: { movie: MediaInfo, onClick: () => void }) => {
  return (

    <li
      onClick={props.onClick}
      className="list-group-item d-flex p-1"
      style={{ height: "100px" }}
    >
      <HolderImage
        src={props.movie.getPosterURL()}
        alt={props.movie.title}
        className="shadow rounded img-fluid h-100"
      />
      <div
        className="ms-2 d-flex flex-column justify-content-between py-2"
      >
        <span className="fw-bold">{props.movie.title}</span>
        <span>{getDateString(props.movie.releaseDate)}</span>
      </div>
    </li>
  )
}
