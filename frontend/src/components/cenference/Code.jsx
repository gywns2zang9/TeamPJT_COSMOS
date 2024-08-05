import React, { useState } from "react";

function Code() {
  const [code, setCode] = useState(`print("hello")\nprint("cosmos")\nprint("A708")`);

  // 코드 입력 핸들러
  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  return (
    <div>
      <textarea
        value={code}
        onChange={handleCodeChange}
        style={{ width: "100%", height: "400px", resize: "none" }}
      />
    </div>
  );
}

export default Code;
