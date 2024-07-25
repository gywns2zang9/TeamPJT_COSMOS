import React from 'react';

// 백그라운드 이미지 URL
const backgroundImageUrl = require('../../assets/error/401error.jpeg');

function Error401(props) {
    const containerStyle = {
        height: '100vh', 
        backgroundImage: `url(${backgroundImageUrl})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: 'white', 
        textAlign: 'center', 
    };

    return (
        <div style={containerStyle}>
            
                <h1>401 - Unauthorized</h1>
                <p>You do not have the necessary credentials to access this page.</p>
            
        </div>
    );
};

export default Error401;
