import React from "react";
import { useFileTreeStore } from "renderer/store/FileTreeStore";
import { IgnoreData } from "renderer/store/ignore";

const SettingPage = () => {

  let ignoreList: IgnoreData[] = [];
  const fileTreeStore = useFileTreeStore();

  const restore = (ignore: IgnoreData) => {
    fileTreeStore.removeIgnore(ignore);
  };

  const importMovieDB = async () => {
    const path = await window.electronAPI.showOpenDialog({});
    if (path) {
      await fileTreeStore.importMovieDB(path[0]);
      window.electronAPI.showMessageBox({
        message: `Import ${path[0]} success`,
        type: "info",
      });
    }
  };

  const storeInitPath = async () => {
    const path = await window.electronAPI.showOpenDialog({
      properties: ["openDirectory"],
    });
    if (path) {
      window.electronAPI.showMessageBox({
        message: `Import ${path[0]} success, restart to take effect`,
        type: "info",
      });
      window.storageAPI.set("path", path[0]);
      window.electronAPI.relauch();
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={importMovieDB}>DB</button>
      <button className="btn btn-primary" onClick={storeInitPath}>Path</button>
      {
        ignoreList.length === 0 ?
          <p>Empty Ignore List</p> :
          <div className="d-flex flex-column h-100">
            <div className="flex-grow-1 overflow-auto container-xxl">
              <ul className="list-group" data-simplebar>
                {ignoreList.map(ignore =>
                  <li
                    className="list-group-item list-group-item-dark d-flex justify-content-between"
                    key={ignore.fullPath}
                  >
                    <p style={{ wordBreak: "break-word" }}>{ignore.fullPath}</p>
                    <button className="btn btn-primary" onClick={() => restore(ignore)}>
                      Restore
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>

      }

    </>
  )
}

export default SettingPage
