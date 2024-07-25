import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import "../../css/conference/videocomponent.css";
import { useEffect, useRef } from "react";

// VideoComponent에 전달될 props의 타입을 정의합니다
// LocalVideoTrack 또는 RemoteVideoTrack을 받을 수 있습니다
function VideoComponent({ track, participantIdentity, local = false }) {
  const videoElement = useRef(null);

  useEffect(() => {
    if (videoElement.current) {
      track.attach(videoElement.current); // 트랙을 비디오 요소에 연결합니다
    }

    return () => {
      track.detach(); // 컴포넌트가 언마운트될 때 트랙을 분리합니다
    };
  }, [track]);

  return (
    <div id={"camera-" + participantIdentity} className="video-container">
      <div className="participant-data">
        <p>{participantIdentity + (local ? " (You)" : "")}</p>
      </div>
      <video ref={videoElement} id={track.sid}></video>
    </div>
  );
}

export default VideoComponent;
