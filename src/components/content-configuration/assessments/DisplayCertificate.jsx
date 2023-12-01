import React from 'react'

const DisplayCertificate = (s3Url) => {
  return (
    <>
        <iframe src={s3Url} frameborder="0"></iframe> 
    </>
  )
}

export default DisplayCertificate
