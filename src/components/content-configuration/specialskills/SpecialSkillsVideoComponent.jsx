import React, { useState, useEffect } from 'react';
import failvideo from "../../../assets/fail.mp4";
import '../assessments/Questions.css';
import Questions from './Questions';

const SpecialSkillsVideoComponent = ({ video, questions }) => {
    const [showVideo, setShowVideo] = useState(true);
    const [countdown, setCountdown] = useState(10);

    const isAudioFile = /\.(mp3|wav|ogg)$/i.test(video); // Add more audio file extensions as needed
    const isImageFile = /\.(png|jpg|jpeg)$/i.test(video);

    const handleVideoComplete = () => {
        setShowVideo(false);
    };

    const handleWatchAgain = () => {
        setShowVideo(true);
        setCountdown(5);
        // Reset other states or handle other logic as needed
    };

    useEffect(() => {
        if (isImageFile) {
            const countdownInterval = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);

            const countdownTimeout = setTimeout(() => {
                clearInterval(countdownInterval);
                setShowVideo(false);
            }, 10000);

            // Clean up intervals and timeouts to avoid memory leaks
            return () => {
                clearInterval(countdownInterval);
                clearTimeout(countdownTimeout);
            };
        }
    }, [isImageFile]);

    useEffect(() => {
        if (countdown === 0) {
            setShowVideo(false);
        }
    }, [countdown]);

    return (
        <>
            {showVideo ? (
                <div className="landing__specialskills-Container">
                    <div>
                        {isAudioFile
                            ? "Listen to the Audio and Answer the Questions"
                            : isImageFile
                                ? `Observe the Image and Answer the Questions`
                                : "Watch the Video and Answer the Questions"}
                    </div>
                    {isAudioFile ? (
                        <audio
                            src={video}
                            controls
                            onEnded={handleVideoComplete}
                            style={{ width: "57%", marginTop:"2rem", border:"2px solid black", borderRadius:"3rem" }}
                        ></audio>
                    ) : isImageFile ? (
                        <>

                            <div
                            style={{ display: "flex", gap: "5rem" }}
                            >
                                <div style={{width:"80%"}}>
                                    <img
                                        src={video}
                                        style={{ height: "60vh" }}
                                        alt="Memory skills image"
                                    />
                                </div>
                                <div style={{ display: 'flex', fontSize: "3rem", color: "black" }}>{countdown}s</div>

                            </div>
                        </>

                    ) : (
                        <video
                            src={video}
                            controls
                            width={600}
                            height={350}
                            onEnded={handleVideoComplete}
                        ></video>
                    )}
                </div>
            ) : (
                <Questions questions={questions} />
            )}
        </>
    );
};

export default SpecialSkillsVideoComponent;
