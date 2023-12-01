import React from 'react';
import { useParams } from 'react-router-dom';
import GobackComponent from './GobackComponent';
const Pdf = () => {
  const { chapter, topic, url } = useParams();
  const decodedUrl = decodeURIComponent(url); // Decode the cloud URL
  return (
    <>
      <GobackComponent />

      <div>
        <iframe
          src={decodedUrl}
          title="Game"
          width="100%"
          height="460"
          frameBorder="0"
          allowFullScreen
          style={{
            paddingBottom: "10vh"
          }}
        ></iframe>
        <button>Generate Questions</button>
      </div>
    </>
  );
};

export default Pdf;