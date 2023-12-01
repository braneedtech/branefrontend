import React from 'react';
import { useParams } from 'react-router-dom';
import GobackComponent from './GobackComponent';

const GamePlayer = () => {
  const { url } = useParams();
  const decodedUrl = decodeURIComponent(url);
  return (
    <>
      <GobackComponent />
      <iframe
        src={url}
        title="Game"
        width="100%"
        height="460"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </>
  );
};

export default GamePlayer;
