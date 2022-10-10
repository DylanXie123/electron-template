import React from "react";
import FileTree from "renderer/store/fileTree";
import { validateNode } from "renderer/store/utils";

export default function OpenBtn(props: { node: FileTree }) {

  const play = () => {
    if (props.node.isLeaf) {
      window.fsAPI.openPath(props.node.fullPath);
    } else {
      const children = Array.from(props.node.children!.values()).filter(validateNode);
      window.fsAPI.openPath(children[0].fullPath);
    }
  };

  const openFolder = () => {
    window.fsAPI.showItem(props.node.fullPath);
  };


  return (
    <div className="d-grid gap-2 px-4">
      {
        props.node.onDisk ?
          <button className="btn btn-primary rounded-pill" onClick={play}>
            <i className="bi bi-play-circle-fill" />
            <span>Watch</span>
          </button>
          :
          <button className="btn btn-primary rounded-pill disabled">
            <i className="bi bi-x-circle-fill" />
            <span>Unavailable</span>
          </button>
      }
      <button className="btn btn-primary rounded-pill" onClick={openFolder}>
        <i className="bi bi-folder2-open" />
        <span>Folder</span>
      </button>
    </div>
  )
}
