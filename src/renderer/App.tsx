import React, { useState } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Homepage from './pages/HomePage';
import SettingPage from './pages/SettingPage';
import FileTreeStore, { FileTreeStoreContext } from './store/FileTreeStore';
import { readFileTree } from './store/utils';

const App = () => {
  return (
    <Router>
      <div className="d-flex flex-column vh-100">
        <nav
          className="navbar navbar-expand-lg navbar-dark sticky-top bg-dark border-bottom border-light"
        >
          <Link to={"/"} className="navbar-brand me-auto p-2">
            <i className="bi bi-film" />
            <span>MovieDB</span>
          </Link>
          <span className="nav-link" role="button" >
            <i className="bi bi-shuffle" />
          </span>
          <Link to={"/setting"} className="nav-link">
            <i className="bi bi-gear-wide-connected" />
          </Link>
        </nav>
        <div className="flex-grow-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<InitComponent />} />
            <Route path="/setting" element={<SettingPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

const loadingPath = () => {
  return new Promise<string>((resolve, reject) => {
    const path = window.storageAPI.get("path") as string;
    if (path) {
      resolve(path)
    } else {
      reject(undefined);
    }
  });
}

interface LoadingStatus {
  isLoading: boolean,
  path: string | undefined,
}

const InitComponent = () => {
  const [status, setStatus] = useState<LoadingStatus>({
    isLoading: true,
    path: undefined
  });
  loadingPath().then(
    p => { setStatus({ isLoading: false, path: p }) },
    _ => { setStatus({ isLoading: false, path: undefined }) }
  );

  return (
    status.isLoading ? <div>Loading</div> :
      status.path ? <ContextedHomepage path={status.path} /> : <Navigate to="/setting" replace={true} />
  )
}

const ContextedHomepage = ({ path }: { path: string }) => {
  const fileTreeStore = new FileTreeStore(readFileTree(path)!);

  return (
    <FileTreeStoreContext.Provider value={fileTreeStore}>
      <Homepage />
    </FileTreeStoreContext.Provider>
  )
}