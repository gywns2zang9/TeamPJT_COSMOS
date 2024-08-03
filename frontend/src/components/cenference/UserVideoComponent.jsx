import React from "react";
import OpenViduVideoComponent from "./OvVideo";
import "../../css/conference/UserVideo.css";

const UserVideoComponent = ({ streamManager }) => {
  const getNicknameTag = () => {
    // Gets the nickName of the user
    return JSON.parse(streamManager.stream.connection.data).clientData;
  };

  return (
    <div>
      {streamManager !== undefined ? (
        <div>
          <OpenViduVideoComponent streamManager={streamManager} />
          <div className="participant-data">
            <p>{getNicknameTag()}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default UserVideoComponent;
