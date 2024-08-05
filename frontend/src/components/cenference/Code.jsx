import React, { useState } from "react";

function Code() {
  const [code, setCode] = useState(`print("hello")\nprint("cosmos")\nprint("A708")`);

  // 코드 입력 핸들러
  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%',padding: '10px' }}>
      <textarea
        value={code}
        onChange={handleCodeChange}
        style={{ flex: 4, border: '1px solid black', padding: '10px' }}
      />
      <div style={{ display: 'flex', flex: 1, width: '100%', marginTop: '5px', gap: '5px' }}>
        <textarea style={{ flex: 1, padding: '10px', border: '1px solid black' }} />
        <div style={{ flex: 1, border: '1px solid black', padding: '10px', boxSizing: 'border-box' }}>
          result
        </div>
      </div>
    </div>
  );
}

export default Code;
