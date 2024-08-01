import { LocalVideoTrack, RemoteVideoTrack } from "livekit-client";
import "../../css/conference/videocomponent.css";
import { useEffect, useRef, useState } from "react";

// VideoComponent에 전달될 props의 타입을 정의합니다
// LocalVideoTrack 또는 RemoteVideoTrack을 받을 수 있습니다
function VideoComponent({ track, participantIdentity, local = false }) {
  const videoElement = useRef(null);
  const [isMuted, setIsMuted] = useState(track.isMuted);

  useEffect(() => {
    if (videoElement.current) {
      if (!track.isMuted) {
        track.attach(videoElement.current); // 트랙을 비디오 요소에 연결합니다
      } else {
        track.detach(videoElement.current); // 트랙을 비디오 요소에서 분리합니다
      }
    }

    // Track의 상태가 변경될 때 isMuted 상태를 업데이트합니다
    const onTrackMuted = () => setIsMuted(true);
    const onTrackUnmuted = () => setIsMuted(false);

    track.on("muted", onTrackMuted);
    track.on("unmuted", onTrackUnmuted);

    return () => {
      track.off("muted", onTrackMuted);
      track.off("unmuted", onTrackUnmuted);
      track.detach();
    };
  }, [track, isMuted]);

  return (
    <div id={"camera-" + participantIdentity} className="video-container">
      <div className="participant-data">
        <p>{participantIdentity + (local ? " (나)" : "")}</p>
      </div>
      {!track.isMuted ? (
        <video ref={videoElement} id={track.sid}></video>
      ) : (
        <div className="gray-screen">
          <p>기본 이미지</p>
        </div>
      )}
    </div>
  );
}

export default VideoComponent;
