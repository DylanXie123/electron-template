import { observer } from "mobx-react-lite";
import React from "react";
import { useFileTreeStore } from "renderer/store/FileTreeStore"
import HeadBar from "../components/HeadBar"
import MovieCard from "../components/MovieCard"

const GridView = observer(() => {
  const fileTreeStore = useFileTreeStore();
  const gridFileTree = fileTreeStore.getGridFileTree;

  return (
    <div className="d-flex flex-column h-100">
      <HeadBar render={() =>
        <h3 className="m-0" slot="head" style={{ whiteSpace: "nowrap" }}>
          {gridFileTree.length} Movies
        </h3>
      } />
      <div className="flex-grow-1 overflow-auto" data-simplebar>
        <div className="container px-lg-5">
          <div className="row g-4">
            {gridFileTree.map(node => <MovieCard node={node} key={node.fullPath} />)}
          </div>
        </div>
      </div>
    </div>
  )
})

export default GridView
