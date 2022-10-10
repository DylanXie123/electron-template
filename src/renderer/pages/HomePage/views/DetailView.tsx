import React from "react";
import InfoPanel from "renderer/components/InfoPanel";
import OpenBtn from "renderer/components/OpenBtn";
import Search from "renderer/components/Search";
import FileTree from "renderer/store/fileTree";
import { useFileTreeStore } from "renderer/store/FileTreeStore";

const DetailView = (props: { node: FileTree }) => {

  const addIgnore = () => {
    const fileTreeStore = useFileTreeStore();
    fileTreeStore.addIgnore({ fullPath: props.node.fullPath, recursive: false });
  };

  return (
    <div className="h-100" style={{ overflowX: "hidden" }} data-simplebar>
      <Search node={props.node} />
      <div>
        {
          props.node.media ?
            <InfoPanel node={props.node} /> :
            <div className="mb-2">
              <OpenBtn node={props.node} />
            </div>
        }
      </div>
      <div className="d-grid col-6 mx-auto">
        <button className="btn btn-secondary" onClick={addIgnore}>
          <i className="bi bi-dash-circle" />
          <span>Ignore</span>
        </button>
      </div>
    </div>
  )
}

export default DetailView
