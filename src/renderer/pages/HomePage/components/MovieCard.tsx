import React from "react";
import HolderImage from "renderer/components/HolderImage";
import FileTree from "renderer/store/fileTree";
import { useFileTreeStore } from "renderer/store/FileTreeStore";

const MovieCard = (props: { node: FileTree }) => {

  const getSrcset = (node: FileTree) => `
    ${node.media?.getPosterURL("w185")} 1x,
    ${node.media?.getPosterURL("w342")} 2x,
    ${node.media?.getPosterURL("w500")} 3x,
    ${node.media?.getPosterURL("w780")} 4x,
    ${node.media?.getPosterURL("original")} 5x
  `;

  const fileTreeStore = useFileTreeStore();

  const handleClick = () => {
    fileTreeStore.showDetail(props.node);
  }

  return (
    <div className="col-sm-6 col-md-4 col-lg-3 col-xl-2">
      <div className="position-relative">
        <div
          onClick={handleClick}
          role="button"
        >
          <div className="ratio ratio-2x3">
            <HolderImage
              src={props.node.media?.getPosterURL()}
              srcSet={props.node.media?.posterURL ? getSrcset(props.node) : undefined}
              alt={props.node.media?.title}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
