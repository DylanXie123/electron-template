import HolderImage from "../HolderImage";
import type FileTree from "../../store/fileTree";
import { getDateString } from "../../store/utils";
import OpenBtn from "../OpenBtn"
import Placeholder from "./hPlaceholder.jpg"
import { MovieInfo, TVInfo } from "renderer/store/media";
import React from "react";

export default function InfoPanel(props: { node: FileTree }) {
  const getSrcset = (node: FileTree) => `
    ${node.media?.getBackgroundURL("w780")} 1x,
    ${node.media?.getBackgroundURL("w1280")} 2x,
    ${node.media?.getBackgroundURL("original")} 3x
  `;

  return (
    <>
      <HolderImage
        src={props.node.media?.getBackgroundURL()}
        srcSet={getSrcset(props.node)}
        alt="poster"
        placeholder={Placeholder}
      />
      <h1 className="m-2">{props.node.media?.title}</h1>
      <p className="text-secondary mb-3">{props.node.media?.genres.join(", ")}</p>
      <OpenBtn node={props.node} />
      <div className="row my-3 g-1">
        <div className="col-4">
          <p className="text-secondary mb-0">Language</p>
          {props.node.media?.language}
        </div>
        <div className="col-4">
          <p className="text-secondary mb-0">ReleaseDate</p>
          {getDateString(props.node.media?.releaseDate)}
        </div>
        <div className="col-4">
          <p className="text-secondary mb-0">Rating</p>
          {props.node.media?.tmdbRating}
        </div>
        <div className="col-4">
          {props.node.media instanceof MovieInfo ?
            <>
              <p className="text-secondary mb-0">Runtime</p>
              {props.node.media.runtime}
            </>
            : null
          }
          {props.node.media instanceof TVInfo ?
            <>
              <p className="text-secondary mb-0">Seasons</p>
              {props.node.media.seasons.length}
            </>
            : null
          }
        </div>
        <div className="col-4">
          <p className="text-secondary mb-0">TMDB</p>
          {props.node.media?.tmdbID}
        </div>
        <div className="col-4">
          <p className="text-secondary mb-0">IMDB</p>
          tt{props.node.media?.imdbID}
        </div>
      </div>
      <hr />
      {props.node.media?.credits ?
        <>
          <div
            className="overflow-auto my-3"
            data-simplebar
            data-simplebar-auto-hide="false"
          >
            <div className="row flex-nowrap">
              {
                props.node.media.credits.map(cast =>
                  <div className="col-3" key={cast.credit_id}>
                    <div className="ratio ratio-2x3">
                      <HolderImage src={cast.getProfileURL()} alt={cast.name} />
                    </div>
                    <p className="text-secondary mb-0">{cast.name}</p>
                  </div>
                )
              }
            </div>
          </div>
          <hr />
        </>
        : null
      }
      <p>{props.node.media?.overview}</p>
    </>)
}
