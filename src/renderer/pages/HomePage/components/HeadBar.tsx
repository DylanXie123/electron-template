import React from "react";
import { Order, Sort, useFileTreeStore } from "renderer/store/FileTreeStore";

export default function HeadBar(props: { render?: Function }) {

  const fileTreeStore = useFileTreeStore();

  const handleCheck = (e: any) => {
    const checked = e.target.checked;
    if (checked !== undefined) {
      fileTreeStore.setFilterProp({ onlyOnDisk: checked });
    }
  };

  const handleInput = (e: any) => {
    const value = e.target.value;
    if (value !== undefined) {
      fileTreeStore.setFilterProp({ queryStr: value });
    }
  };

  return (
    <div
      className="container-xxl my-3 bg-dark sticky-top d-flex justify-content-between"
    >
      {props.render?.()}
      <div className="d-flex justify-content-end gap-3">
        <div className="dropdown">
          <button
            className="btn btn-transparent dropdown-toggle rounded-pill"
            type="button"
            id="sortBy"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <span className="m-0 me-2 position-relative">
              {fileTreeStore.getFilterProp.sort.toString()}
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill ms-1"
              >
                {fileTreeStore.getFilterProp.order === Order.Asc ?
                  <i className="bi bi-arrow-up-circle" /> :
                  <i className="bi bi-arrow-down-circle" />
                }
              </span>
            </span>
          </button>
          <ul
            className="dropdown-menu dropdown-menu-dark rounded"
            aria-labelledby="sortBy"
          >
            <li>
              <button
                className="dropdown-item"
                onClick={() => fileTreeStore.setFilterProp({ sort: Sort.Random })}
              >
                <i className="bi bi-shuffle me-2" />Random
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => fileTreeStore.setFilterProp({ sort: Sort.Title })}
              >
                <i className="bi bi-type me-2" />Title
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() =>
                  fileTreeStore.setFilterProp({ sort: Sort.ReleaseDate })}
              >
                <i className="bi bi-calendar-date me-2" />Release
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() =>
                  fileTreeStore.setFilterProp({ sort: Sort.TMDBRating })}
              >
                <i className="bi bi-bar-chart me-2" />Rating
              </button>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => fileTreeStore.setFilterProp({ order: Order.Asc })}
              >
                <i className="bi bi-arrow-up me-2" />ascending
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => fileTreeStore.setFilterProp({ order: Order.Desc })}
              >
                <i className="bi bi-arrow-down me-2" />descending
              </button>
            </li>
          </ul>
        </div>
        <div className="form-check m-auto">
          <input
            className="form-check-input bg-dark"
            type="checkbox"
            checked={fileTreeStore.getFilterProp.onlyOnDisk}
            onChange={handleCheck}
            id="checkOnDisk"
          />
          <label className="form-check-label" htmlFor="checkOnDisk"> Disk </label>
        </div>
        <input
          className="form-control rounded-pill"
          value={fileTreeStore.getFilterProp.queryStr}
          onInput={handleInput}
        />
      </div>
    </div>
  )
}
