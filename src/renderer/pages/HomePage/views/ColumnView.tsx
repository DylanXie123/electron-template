import React from "react";
import { useFileTreeStore } from "renderer/store/FileTreeStore"
import HeadBar from "../components/HeadBar"

const ColumnView = () => {

  const fileTreeStore = useFileTreeStore();


  return (
    <div className="h-100">
      <HeadBar />
      <div className="d-flex container-fluid h-100">
        {
          fileTreeStore.getColumnFileTree.map(nodes =>
            <div
              className="flex-grow-1 overflow-auto"
              style={{ minWidth: 0 }}
              data-simplebar
              key={nodes[0].fullPath + "list"}
            >
              <div className="list-group list-group-flush">
                {
                  nodes.map(child =>
                    <button
                      className="list-group-item list-group-item-dark list-group-item-action text-nowrap"
                      title={child.parsed.base}
                      onClick={() => fileTreeStore.showDetail(child)}
                      key={child.fullPath}
                    >
                      <div style={{ textOverflow: "ellipsis", overflow: "hidden" }}>
                        {child.parsed.base}
                      </div>
                    </button>
                  )
                }


              </div>
            </div>
          )
        }
      </div>
    </div>

  )
}

export default ColumnView
