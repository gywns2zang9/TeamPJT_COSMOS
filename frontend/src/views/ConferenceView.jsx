import { OpenVidu } from "openvidu-browser";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Code from "../components/conference/Code";
import Paint from "../components/conference/Paint";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import axios from "axios";
import UserVideoComponent from "../components/conference/UserVideoComponent";
import LeaveSessionModal from "../modals/LeaveSessionModal";
import "../css/conference/conference.css";
import useAuthStore from "../store/auth";

const APPLICATION_SERVER_URL = "https://i11a708.p.ssafy.io/";
// const APPLICATION_SERVER_URL = "http://localhost:8080/";

function ConferenceView(props) {
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const getUserInfo = useAuthStore((state) => state.getUserInfo);
  const userInfo = getUserInfo();
  const navigate = useNavigate();
  const { groupId } = useParams();

  const [myUserName, setMyUserName] = useState(userInfo.nickName);
  const [isOpen, setIsOpen] = useState(true);
  const [isVideoEnabled, setisVideoEnabled] = useState(true);
  const [isMicEnabled, setisMicEnabled] = useState(true);
  const [mySessionId, setMySessionId] = useState(groupId);
  const [showPaint, setShowPaint] = useState(true);
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [OV, setOV] = useState(null);
  const [currentVideoDevice, setCurrentVideoDevice] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false); // 채팅창 모달 상태
  const [chatMessages, setChatMessages] = useState([]); // 채팅 메시지 상태
  const [newMessage, setNewMessage] = useState(""); // 새로운 메시지 입력 상태
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const VideoToggleIcon = isVideoEnabled ? VideocamIcon : VideocamOffIcon;
  const MicToggleIcon = isMicEnabled ? MicIcon : MicOffIcon;

  const toggleVideo = () => {
    setIsOpen(!isOpen);
  };

  const handleTogglePaint = () => {
    setShowPaint((prevShowPaint) => !prevShowPaint);
  };

  const handleToggleChat = () => {
    setShowChat((prevShowChat) => !prevShowChat);
    setHasNewMessage(false);
    console.log(showChat);
  };

  const handleSendMessage = () => {
    if (session && newMessage.trim()) {
      session
        .signal({
          data: newMessage,
          to: [],
          type: "my-chat",
        })
        .then(() => {
          console.log("Message successfully sent");
          setNewMessage("");
        })
        .catch((error) => {
          console.error(error);
        });
    }
    console.log(newMessage);
  };

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSendMessage();
      e.preventDefault(); // 기본 Enter 키 동작 방지 (Shift 키가 눌리지 않은 경우에만)
    }
  };

  useEffect(() => {
    const chatBody = document.querySelector(".chat-body");
    chatBody.scrollTop = chatBody.scrollHeight; // 스크롤을 아래로 이동
  }, [chatMessages]); // chatMessages가 업데이트될 때마다 실행

  useEffect(() => {
    if (session) {
      session.on("signal:my-chat", (event) => {
        const senderData = JSON.parse(event.from.data);
        const isCurrentUser = senderData.clientData === myUserName; // 현재 사용자가 보낸 메시지인지 확인

        setChatMessages((prevMessages) => [
          ...prevMessages,
          { from: senderData.clientData, text: event.data, isCurrentUser },
        ]);

        // 채팅창이 열려있지 않고, 새 메시지가 현재 사용자에게서 오지 않은 경우에만 알림을 표시
        if (!isCurrentUser && !showChat) {
          setHasNewMessage(true);
        }
      });
    }
  }, [session, myUserName]);

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      // 화면 공유 시작
      try {
        // 기존의 스트림 중지
        if (publisher) {
          session.unpublish(publisher);
        }

        // 새로운 화면 공유 스트림 생성
        const screenPublisher = await OV.initPublisherAsync(undefined, {
          videoSource: "screen",
          publishAudio: true, // 필요시 오디오 포함 여부 설정
          mirror: false,
        });

        screenPublisher.once("accessAllowed", () => {
          session.publish(screenPublisher);
          setPublisher(screenPublisher); // 새 publisher 설정
          setIsScreenSharing(true);
        });

        screenPublisher.once("accessDenied", () => {
          console.warn("ScreenShare: Access Denied");
        });

        // 화면 공유 스트림 종료 시 이벤트 처리
        screenPublisher.stream
          .getMediaStream()
          .getVideoTracks()[0]
          .addEventListener("ended", () => {
            session.unpublish(publisher);
            setIsScreenSharing(false);
            publishCameraStream(); // 화면 공유 종료 시 카메라 스트림으로 전환
          });
      } catch (error) {
        publishCameraStream(); // 카메라 스트림으로 전환
        console.error("Error starting screen share:", error);
      }
    } else {
      // 화면 공유 중지
      if (publisher) {
        session.unpublish(publisher);
      }
      setIsScreenSharing(false);
      publishCameraStream(); // 카메라 스트림으로 전환
    }
  };

  const publishCameraStream = async () => {
    try {
      let newPublisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: isMicEnabled, // 현재 마이크 상태 반영
        publishVideo: true,
        resolution: "640x480",
        frameRate: 30,
        insertMode: "APPEND",
        mirror: false,
      });

      session.publish(newPublisher);
      setPublisher(newPublisher); // 새 publisher 설정
    } catch (error) {
      console.error("Error publishing camera stream:", error);
    }
  };

  const toggleScreen = () => {
    if (publisher) {
      if (isVideoEnabled) {
        publisher.publishVideo(false); // 비디오 전송 중지
        setTimeout(() => {
          const videoTrack = publisher.stream
            .getMediaStream()
            .getVideoTracks()[0];
          videoTrack.stop(); // 비디오 스트림을 중지
        }, 150);
      } else {
        // 비디오 스트림 재개
        const videoSource = currentVideoDevice.deviceId;
        OV.getUserMedia({
          videoSource,
        })
          .then((mediaStream) => {
            const newVideoTrack = mediaStream.getVideoTracks()[0];
            publisher.replaceTrack(newVideoTrack);
            publisher.publishVideo(true); // 비디오 전송 재개
          })
          .catch((error) => {
            console.error("Error restarting video track:", error);
          });
      }
      setisVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleMic = () => {
    if (publisher) {
      publisher.publishAudio(!isMicEnabled);
      setisMicEnabled(!isMicEnabled);
    }
  };

  useEffect(() => {
    const session = joinSession();

    const handleBeforeUnload = (event) => {
      leaveSession(session);
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      leaveSession(session);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleMainVideoStream = (stream) => {
    setMainStreamManager(stream);
    setShowPaint(false);
  };

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

    newSession.on("sessionDisconnected", (event) => {
      if (event.reason === "forceDisconnectByServer") {
        alert("연결이 끊겼습니다.");
        navigate(`/group/${groupId}/main`);
      }
    });

    newSession.on("exception", (exception) => {
      console.warn(exception);
    });

    // 4) 유효한 사용자 토큰으로 세션에 연결
    getToken().then((token) => {
      newSession
        .connect(token, { clientData: myUserName })
        .then(async () => {
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
        })
        .catch((error) => {
          console.log("세션에 연결하는 동안 오류가 발생했습니다:", error);
          if (error.name === "DEVICE_ACCESS_DENIED") {
            alert(
              "장치 접근이 거부되었습니다. 카메라나 마이크의 사용 권한을 확인하세요"
            );
          }
          navigate(`/group`);
        });
    });

    return newSession;
  };

  const leaveSession = (session) => {
    // console.log("leaveSession : ", session)
    if (session) {
      session.disconnect();
    }

    setOV(null);
    setSession(undefined);
    setSubscribers([]);
    setMySessionId(groupId);
    setMyUserName(myUserName);
    setMainStreamManager(undefined);
    setPublisher(undefined);

    navigate(`/group/${groupId}/main`);
  };

  const handleLeaveButtonClick = () => {
    setShowLeaveModal(true);
  };

  const handleCloseLeaveModal = () => {
    setShowLeaveModal(false);
  };

  const handleLeaveSession = () => {
    leaveSession();
    setShowLeaveModal(false);
  };

  async function getToken() {
    const sessionId = await createSession(mySessionId);
    return await createToken(sessionId);
  }

  async function createSession(sessionId) {
    const accessToken = await useAuthStore.getState().getAccessToken();
    try {
      const response = await axios.post(
        APPLICATION_SERVER_URL + "api/sessions/teams/" + sessionId,
        { customSessionId: sessionId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data; // sessionId
    } catch (error) {
      // 여기서 그룹에 속하지 않은 경우 또는 인증 실패 시 처리

      navigate(`/group`); // 그룹 메인 페이지로 이동
      console.log(error);
    }
  }

  async function createToken(sessionId) {
    const accessToken = await useAuthStore.getState().getAccessToken();
    try {
      const response = await axios.post(
        APPLICATION_SERVER_URL +
          "api/sessions/teams/" +
          sessionId +
          "/connections",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data; // token
    } catch (error) {
      // 토큰 발급 실패 시 처리
      alert("접근 권한이 없습니다.");
      navigate(`/group`);
      console.log(error);
    }
  }

  return (
    <div className="conference">
      {session !== undefined ? (
        <div className={`video ${isOpen ? "open" : "closed"}`}>
          {publisher !== undefined ? (
            <div
              className="video-container"
              onClick={() => handleMainVideoStream(publisher)}
            >
              <UserVideoComponent streamManager={publisher} />
            </div>
          ) : null}
          {subscribers.map((sub, i) => (
            <div
              className="video-container"
              key={sub.id}
              onClick={() => handleMainVideoStream(sub)}
            >
              <UserVideoComponent streamManager={sub} />
            </div>
          ))}
        </div>
      ) : null}
      <div className="code-paint-space">
        <Code toggleVideo={toggleVideo} isOpen={isOpen} groupId={groupId} />
        <div className="right-space">
          <div className="paint-upper-space">
            <div>
              <button className="button" onClick={handleTogglePaint}>
                {showPaint ? "화면 보기" : "그림판"}
              </button>
            </div>
            <div>
              <button className="button chat-button" onClick={handleToggleChat}>
                채팅
                {hasNewMessage && (
                  <span className="new-message-indicator"></span>
                )}
              </button>
            </div>
          </div>
          <div className="paint-space">
            {showPaint ? (
              <Paint groupId={groupId} />
            ) : (
              mainStreamManager && (
                <UserVideoComponent streamManager={mainStreamManager} />
              )
            )}
          </div>
          <div className={`chat-modal ${showChat ? "open" : ""}`}>
            <div className="chat-header">
              <h3>채팅</h3>
              <button
                className="button button-close"
                onClick={handleToggleChat}
              >
                닫기
              </button>
            </div>
            <div className="chat-body">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.isCurrentUser ? "current-user" : "other-user"
                  }`}
                >
                  <strong>{msg.from}</strong>
                  <br />
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-footer">
              <textarea
                value={newMessage}
                onChange={handleNewMessageChange}
                onKeyDown={handleKeyPress}
                placeholder="메시지를 입력하세요..."
              />
              <button onClick={handleSendMessage}>전송</button>
            </div>
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
            </div>
            <div className="share-quit-buttons">
              <button className="button-share" onClick={toggleScreenShare}>
                화면 공유하기
              </button>
              <button className="button-quit" onClick={handleLeaveButtonClick}>
                나가기
              </button>
              <LeaveSessionModal
                show={showLeaveModal}
                handleClose={handleCloseLeaveModal}
                handleLeaveSession={handleLeaveSession}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConferenceView;
