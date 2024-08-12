import React from 'react';


function Error403(props) {
    const containerStyle = {
        height: '100vh',  
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
            <h1>403 - Forbidden</h1>
            <p>You do not have permission to view this page.</p>
        </div>
    );
};

export default Error403;