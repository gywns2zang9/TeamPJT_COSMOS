import { LocalAudioTrack, RemoteAudioTrack } from "livekit-client";
import { useEffect, useRef } from "react";

// AudioComponent에 전달될 props의 타입을 정의합니다
// LocalAudioTrack 또는 RemoteAudioTrack을 받을 수 있습니다
function AudioComponent({ track }) {
  const audioElement = useRef(null);

  useEffect(() => {
    if (audioElement.current) {
      track.attach(audioElement.current); // 트랙을 오디오 요소에 연결합니다
    }

    return () => {
      track.detach(); // 컴포넌트가 언마운트될 때 트랙을 분리합니다
    };
  }, [track]);

  return <audio ref={audioElement} id={track.sid} />;
}

export default AudioComponent;
