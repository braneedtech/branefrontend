
import React from 'react';
import { useParams } from 'react-router-dom';
import GobackComponent from './GobackComponent';

const Ppt = () => {
  const { url } = useParams();
  const decodedUrl = decodeURIComponent(url);

  return (

    <>
      <GobackComponent />
      <iframe

        src={`https://view.officeapps.live.com/op/embed.aspx?src=${url}`}

        title="Game"

        width="100%"

        height="460"

        allowFullScreen
        style={{
          paddingBottom: "10vh",
          border: "none"
        }}

      ></iframe>
    </>



  );

};



export default Ppt;


