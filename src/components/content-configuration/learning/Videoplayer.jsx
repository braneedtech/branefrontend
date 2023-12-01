import React from "react";
const VideoPlayer = React.forwardRef((props, ref) => {
    return (
        <video controls poster={props.poster} ref={ref} onEnded={props.onEnded}>
            <source src={props.src} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
});
export default VideoPlayer;
