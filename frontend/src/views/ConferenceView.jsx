import React, { useEffect, useState } from "react";
import {
  LocalVideoTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
} from "livekit-client";
import Code from "../components/cenference/Code";
import Paint from "../components/cenference/Paint";
import VideoComponent from "../components/cenference/VideoComponent";
import AudioComponent from "../components/cenference/AudioComponent";
import VolumeSlider from "../components/cenference/VolumeSlider";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import "../css/conference/conference.css";

// 로컬 개발의 경우, 이 변수들을 비워두세요
// 프로덕션의 경우, 배포에 따라 올바른 URL로 구성하세요
let APPLICATION_SERVER_URL = "";
let LIVEKIT_URL = "wss://my-first-app-9i47gdkl.livekit.cloud";
configureUrls();

function configureUrls() {
  // APPLICATION_SERVER_URL이 구성되지 않은 경우, 로컬 개발의 기본값을 사용합니다
  if (!APPLICATION_SERVER_URL) {
    if (window.location.hostname === "localhost") {
      APPLICATION_SERVER_URL = "http://localhost:6080/";
    } else {
      APPLICATION_SERVER_URL = "https://" + window.location.hostname + ":6443/";
    }
  }

  // LIVEKIT_URL이 구성되지 않은 경우, 로컬 개발의 기본값을 사용합니다
  if (!LIVEKIT_URL) {
    if (window.location.hostname === "localhost") {
      LIVEKIT_URL = "ws://localhost:7880/";
    } else {
      LIVEKIT_URL = "wss://" + window.location.hostname + ":7443/";
    }
  }
}

function ConferenceView(props) {
  const [isOpen, setIsOpen] = useState(true);
  const [room, setRoom] = useState(undefined);
  const [localTrack, setLocalTrack] = useState(undefined);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMicEnabled, setisMicEnabled] = useState(true);
  const [participantName, setParticipantName] = useState(
    "Participant" + Math.floor(Math.random() * 100)
  );
  const [remoteTracks, setRemoteTracks] = useState([]);
  const [roomName, setRoomName] = useState("GroupName");
  const VideoToggleIcon = isVideoEnabled ? VideocamOffIcon : VideocamIcon;
  const MicToggleIcon = isMicEnabled ? MicOffIcon : MicIcon;

  const toggleVideo = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    joinRoom();

    // 컴포넌트가 언마운트 될 때 룸을 떠납니다
    return () => {
      leaveRoom();
    };
  }, []);

  async function joinRoom() {
    // 새로운 Room 객체를 초기화합니다
    const room = new Room();
    setRoom(room);

    // 룸에서 이벤트가 발생할 때 동작을 지정합니다
    // 새로운 트랙이 수신될 때마다...
    room.on(RoomEvent.TrackSubscribed, (_track, publication, participant) => {
      setRemoteTracks((prev) => [
        ...prev,
        {
          trackPublication: publication,
          participantIdentity: participant.identity,
        },
      ]);
    });

    // 트랙이 파괴될 때마다...
    room.on(RoomEvent.TrackUnsubscribed, (_track, publication) => {
      setRemoteTracks((prev) =>
        prev.filter(
          (track) => track.trackPublication.trackSid !== publication.trackSid
        )
      );
    });
    try {
      // 애플리케이션 서버에서 룸 이름과 참가자 이름으로 토큰을 가져옵니다
      const token = await getToken(roomName, participantName);

      // LiveKit URL과 토큰으로 룸에 연결합니다
      await room.connect(LIVEKIT_URL, token);

      // 카메라와 마이크를 게시합니다
      await room.localParticipant.enableCameraAndMicrophone();
      const videoTrack = room.localParticipant.videoTrackPublications
        .values()
        .next().value.videoTrack;
      setLocalTrack(videoTrack);
    } catch (error) {
      console.log("룸에 연결하는 동안 오류가 발생했습니다:", error.message);
      await leaveRoom();
    }
  }

  async function leaveRoom() {
    // Room 객체의 'disconnect' 메서드를 호출하여 룸을 떠납니다
    await room?.disconnect();

    // 상태를 초기화합니다
    setRoom(undefined);
    setLocalTrack(undefined);
    setRemoteTracks([]);
  }

  async function getToken(roomName, participantName) {
    const response = await fetch(APPLICATION_SERVER_URL + "token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomName: roomName,
        participantName: participantName,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`토큰 가져오기 실패: ${error.errorMessage}`);
    }

    const data = await response.json();
    return data.token;
  }

  const toggleVideoStream = async () => {
    if (localTrack) {
      if (isVideoEnabled) {
        await localTrack.mute(); // 비디오 스트림 비활성화
      } else {
        await localTrack.unmute(); // 비디오 스트림 활성화
      }
      setIsVideoEnabled(!isVideoEnabled); // 상태 업데이트
      // console.log(localTrack);
      // console.log(remoteTracks);
    }
  };

  const toggleMic = async () => {
    setisMicEnabled(!isMicEnabled);
  };

  return (
    <div className="conference">
      <div className={`video ${isOpen ? "open" : "closed"}`}>
        {localTrack && (
          <VideoComponent
            track={localTrack}
            participantIdentity={participantName}
            local={true}
          />
        )}
        {remoteTracks.map((remoteTrack) =>
          remoteTrack.trackPublication.kind === "video" ? (
            <VideoComponent
              key={remoteTrack.trackPublication.trackSid}
              track={remoteTrack.trackPublication.videoTrack}
              participantIdentity={remoteTrack.participantIdentity}
            />
          ) : (
            isMicEnabled && (
              <AudioComponent
                key={remoteTrack.trackPublication.trackSid}
                track={remoteTrack.trackPublication.audioTrack}
              />
            )
          )
        )}
      </div>
      <div className="code-paint-space">
        <div className="left-space">
          <div className="code-upper-space">
            <div>
              <button className="button">백준</button>
              <button className="button">프로그래머스</button>
              <button className="button">SWEA</button>
            </div>
            <div>
              <button className="button" onClick={toggleVideo}>
                {isOpen ? "⇑" : "⇓"}
              </button>
            </div>
          </div>
          <div className="code-space">
            <Code />
          </div>
          <div className="code-lower-space">
            <button className="button">코드 공유하기</button>
            <button className="button">코드 저장하기</button>
            <button className="button">내 코드 보기</button>
            <button className="button">공유 코드 보기</button>
          </div>
        </div>
        <div className="right-space">
          <div className="paint-upper-space">
            <div>
              <button className="button">그림판</button>
              <button className="button">화면공유</button>
            </div>
            <div>
              <button className="button">채팅</button>
            </div>
          </div>
          <div className="paint-space">
            <Paint />
          </div>
          <div className="paint-lower-space">
            <div className="conference-control">
              <button className="button" onClick={toggleVideoStream}>
                <VideoToggleIcon style={{ cursor: "pointer" }} />
                <span>{isVideoEnabled ? "비디오 종료" : "비디오 시작"}</span>
              </button>
              <button className="button" onClick={toggleMic}>
                <MicToggleIcon style={{ cursor: "pointer" }} />
                <span>{isMicEnabled ? "음소거 해제" : "음소거"}</span>
              </button>
              {/* <div className="volume-slider">
                <VolumeSlider />
              </div> */}
            </div>
            <div className="share-quit-buttons">
              <button className="button-share">화면 공유하기</button>
              <button className="button-quit" onClick={leaveRoom}>
                나가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConferenceView;
