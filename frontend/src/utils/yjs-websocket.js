// yjs-websocket.js
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { WebsocketProvider } from 'y-websocket';

export const setupYjsDoc = (docId) => {
    const ydoc = new Y.Doc();
    const wsProvider = new WebsocketProvider('wss://demos.yjs.dev/ws', docId, ydoc);

    return { ydoc, wsProvider };
};
