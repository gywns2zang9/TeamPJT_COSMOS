// src/utils/yjs-websocket.js
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { WebsocketProvider } from 'y-websocket';

export const setupYjsDoc = (docId) => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider('wss://demos.yjs.dev', docId, ydoc);
    
    // Optionally, you can also use WebrtcProvider for peer-to-peer connections.
    // const provider = new WebrtcProvider(docId, ydoc);

    return { ydoc, provider };
};
