import { OpenVidu } from "openvidu-browser";

import React, { useEffect, useState } from "react";
import Code from "../components/cenference/Code";
import Paint from "../components/cenference/Paint";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import axios from "axios";
import UserVideoComponent from "../components/cenference/UserVideoComponent";
import "../css/conference/conference.css";

// const APPLICATION_SERVER_URL =
//   process.env.NODE_ENV === "production" ? "" : "https://demos.openvidu.io/";
const APPLICATION_SERVER_URL = "https://i11a708.p.ssafy.io/";

function ConferenceView(props) {
  const [isOpen, setIsOpen] = useState(true);
  const [isVideoEnabled, setisVideoEnabled] = useState(true);
  const [isMicEnabled, setisMicEnabled] = useState(true);
  const [mySessionId, setMySessionId] = useState("groupName");
  const [myUserName, setMyUserName] = useState(
    "Participant" + Math.floor(Math.random() * 100)
  );
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [OV, setOV] = useState(null);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);
  const VideoToggleIcon = isVideoEnabled ? VideocamIcon : VideocamOffIcon;
  const MicToggleIcon = isMicEnabled ? MicIcon : MicOffIcon;

  const toggleVideo = () => {
    setIsOpen(!isOpen);
  };

  const toggleScreen = () => {
    if (publisher) {
      publisher.publishVideo(!isVideoEnabled);
      setisVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleMic = () => {
    if (publisher) {
      publisher.publishAudio(!isMicEnabled);
      setisMicEnabled(!isMicEnabled);
      console.log(publisher);
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", onbeforeunload);
    joinSession();
    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
      // leaveSession();
    };
  }, []);

  const onbeforeunload = (event) => {
    leaveSession();
  };

  // const handleChangeSessionId = (e) => {
  //   setMySessionId(e.target.value);
  // };

  // const handleChangeUserName = (e) => {
  //   setMyUserName(e.target.value);
  // };

  // const handleMainVideoStream = (stream) => {
  //   if (mainStreamManager !== stream) {
  //     setMainStreamManager(stream);
  //   }
  // };

  const deleteSubscriber = (streamManager) => {
    setSubscribers((prevSubscribers) =>
      prevSubscribers.filter((subscriber) => subscriber !== streamManager)
    );
  };

  const joinSession = () => {
    // 1) OpenVidu 객체 생성
    const newOV = new OpenVidu();
    setOV(newOV);

    // 2) 세션 초기화
    const newSession = newOV.initSession();
    setSession(newSession);

    // 3) 세션에서 이벤트가 발생했을 때의 동작 지정
    newSession.on("streamCreated", (event) => {
      var subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    newSession.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    newSession.on("exception", (exception) => {
      console.warn(exception);
    });

    // 4) 유효한 사용자 토큰으로 세션에 연결
    getToken().then((token) => {
      newSession
        .connect(token, { clientData: myUserName })
        .then(async () => {
          // 5) 자신의 카메라 스트림 가져오기
          let newPublisher = await newOV.initPublisherAsync(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: "640x480",
            frameRate: 30,
            insertMode: "APPEND",
            mirror: false,
          });

          newSession.publish(newPublisher);

          // 현재 사용 중인 비디오 장치를 얻습니다
          var devices = await newOV.getDevices();
          var videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
          );
          var currentVideoDeviceId = newPublisher.stream
            .getMediaStream()
            .getVideoTracks()[0]
            .getSettings().deviceId;
          var currentVideoDevice = videoDevices.find(
            (device) => device.deviceId === currentVideoDeviceId
          );

          setCurrentVideoDevice(currentVideoDevice);
          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
          console.log(subscribers);
        })
        .catch((error) => {
          console.log(
            "세션에 연결하는 동안 오류가 발생했습니다:",
            error.code,
            error.message
          );
        });
    });
  };

  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }

    setOV(null);
    setSession(undefined);
    setSubscribers([]);
    setMySessionId("groupName");
    setMyUserName("Participant" + Math.floor(Math.random() * 100));
    setMainStreamManager(undefined);
    setPublisher(undefined);
  };

  async function getToken() {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  }

  async function createSession(sessionId) {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions",
      { customSessionId: sessionId },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // The sessionId
  }

  async function createToken(sessionId) {
    const response = await axios.post(
      APPLICATION_SERVER_URL + "api/sessions/" + sessionId + "/connections",
      {},
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data; // The token
  }

  return (
    <div className="conference">
      {session !== undefined ? (
        <div className={`video ${isOpen ? "open" : "closed"}`}>
          {publisher !== undefined ? (
            <div>
              <UserVideoComponent streamManager={publisher} />
            </div>
          ) : null}
          {subscribers.map((sub, i) => (
            <div key={sub.id}>
              <UserVideoComponent streamManager={sub} />
            </div>
          ))}
        </div>
      ) : null}
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
              <button className="button" onClick={toggleScreen}>
                <VideoToggleIcon style={{ cursor: "pointer" }} />
                <span>{isVideoEnabled ? " 비디오 종료" : " 비디오 시작"}</span>
              </button>
              <button className="button" onClick={toggleMic}>
                <MicToggleIcon style={{ cursor: "pointer" }} />
                <span>{isMicEnabled ? " 음소거" : " 음소거 해제"}</span>
              </button>
              {/* <div className="volume-slider">
                <VolumeSlider />
              </div> */}
            </div>
            <div className="share-quit-buttons">
              <button className="button-share">화면 공유하기</button>
              <button className="button-quit" onClick={leaveSession}>
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
