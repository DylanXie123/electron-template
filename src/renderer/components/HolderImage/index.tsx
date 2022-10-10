import React from 'react';
import { useState } from 'react';
import Placeholder from './placeholder.jpg';

enum Status {
  Loading,
  Complete,
  Error,
}

const HolderImage = ({
  src,
  placeholder,
  ...props
}: React.HTMLProps<HTMLImageElement>) => {
  const [status, updateStatus] = useState(Status.Loading);

  const onError = () => {
    updateStatus(Status.Error);
  };

  const onLoad = () => {
    updateStatus(Status.Complete);
  };

  return (
    <>
      <img
        src={src}
        alt={props.alt}
        className={"shadow rounded img-fluid"}
        hidden={status !== Status.Complete}
        onLoad={onLoad}
        onError={onError}
      />
      <img
        src={placeholder ?? Placeholder}
        alt="placeholder"
        className={"shadow rounded img-fluid"}
        hidden={status === Status.Complete}
      />
    </>
  );
}

export default HolderImage;