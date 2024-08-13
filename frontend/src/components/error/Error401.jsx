import React from 'react';


function Error401(props) {
    const containerStyle = {
        height: '100vh', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: 'white', 
        textAlign: 'center', 
    };

    return (
        <div style={containerStyle}>
            
                <h1>401 - Unauthorized</h1>
                <p>페이지에 접근할 수 없습니다.</p>
            
        </div>
    );
};

export default Error401;
