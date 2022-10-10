import { observer } from "mobx-react-lite";
import React from "react";
import { useState } from "react"
import { useFileTreeStore } from "renderer/store/FileTreeStore";
import ColumnView from "./views/ColumnView";
import DetailView from "./views/DetailView";
import GridView from "./views/GridView";

export enum View {
  Grid,
  Column,
}

const HomePage = observer(() => {
  const [viewState] = useState(View.Grid);
  const fileTreeStore = useFileTreeStore();
  const selected = fileTreeStore.getSelected;

  return (
    <>
      <div className="row justify-content-center h-100">
        <div className="col-lg-9 col-sm-8 h-100">
          {viewState === View.Grid ? <GridView /> : <ColumnView />}
        </div>
        {selected ?
          <div className="col-lg-3 col-sm-4 ps-2 h-100">
            <DetailView node={selected} />
          </div>
          : null
        }
      </div>
    </>

  )
})

export default HomePage
