import React from 'react';
import useGroupStore from '../store/group.js'; 
import '../css/Loading.css'; 

const Loading = () => {
    const { loading } = useGroupStore(state => ({ loading: state.loading }));

    if (!loading) return null;

    return (
        <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <div className="loading-message">Loading...</div>
        </div>
    );
};

export default Loading;
