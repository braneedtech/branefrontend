import React, { useState, useEffect } from "react";
import axios from "axios";
import StudentDetailsCustomHook from "../../context-api/StudentDetailsCustomHook";
import TakeImage from "../../signup/TakeImage";
import AudioRecorder from "../../signup/AudioRecorder";
const ProfileInformation = () => {
  const { student } = StudentDetailsCustomHook();
  let personal_info = student;
  const [photoUrl, setPhotoUrl] = useState(null);
  const[AudioUrl,setAudioUrl]=useState(null);
  const [showPhoto, setShowPhoto] = useState(false); // New state for showing the photo
  const [playingAudio, setPlayingAudio] = useState(false);
  const parentsmobileno = personal_info.mobileno;
  const childindex = personal_info.childIndex;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8080/personal-info`,
          {
            params: {
              parentsmobileno,
              childindex,
            },
          }
        );
        setPhotoUrl(response.data.childimageurl  + `?timestamp=${Date.now()}`);
        setAudioUrl(response.data.childaudiourl);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const handleViewPhoto = () => {
    setShowPhoto(true);
  };
  const handlePlayAudio = () => {
    setPlayingAudio(true);
  };

  return (
    <div style={{height:'100vh'}}>
      <div style={{display:'flex',justifyContent:'center',color:'#4130ae',paddingBottom:'1.25rem',paddingTop:'.5rem'}}>
        <h4>Update Your Profile Photo</h4>
      </div>
      <div style={{ display: "flex", gap: "3rem",paddingLeft:'35%'}}>
      {photoUrl && (
          <div style={{marginTop:".75vw"}}>
            {!showPhoto ? (
              <button style={{backgroundColor:'#4130ae',textDecoration:'none',border:'none',color:'white',padding:'0.35rem 1.25rem',fontSize:'.9rem',borderRadius:'.75rem'}}onClick={handleViewPhoto}>View Photo</button>
            ) : (
              <img src={photoUrl} alt="Profile" style={{ maxWidth: "200px", maxHeight: "200px" }} />
            )}
          </div>
        )}
        <TakeImage mobileno={parentsmobileno} childno={childindex + 1} />
      </div>
      <div style={{display:'flex',justifyContent:'center',color:'#4130ae',paddingTop:'4rem',paddingBottom:'1rem'}}>
        <h4 >Update Your audio</h4>
      </div>
      <div style={{ display: "flex",flexDirection:"column", gap: "3rem", alignItems:'center' }}>
      {!playingAudio && (
          <button style={{ backgroundColor: '#4130ae', textDecoration: 'none', border: 'none', color: 'white', padding: '0.35rem 1.25rem', fontSize: '.9rem', borderRadius: '.75rem' }} onClick={handlePlayAudio}>Play Audio</button>
        )}
        {playingAudio && AudioUrl && (
          <audio controls>
            <source src={AudioUrl} type="audio/mpeg" />
          </audio>
        )}
        {/* {AudioUrl && (
         <audio controls>
           <source src={AudioUrl} type="audio/mpeg" />
         </audio>
        )} */}
        <AudioRecorder mobileno={parentsmobileno} childno={childindex + 1} />
      </div>
    </div>
  );
};

export default ProfileInformation;
