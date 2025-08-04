// preload.js

// preload.js

const { contextBridge, ipcRenderer } = require('electron');

// 메인 프로세스와 안전하게 통신할 수 있는 API를 노출합니다.
contextBridge.exposeInMainWorld('electron', {
    // 렌더러 -> 메인 (단방향)
    send: (channel, data) => ipcRenderer.send(channel, data),
    
    // 렌더러 -> 메인 (양방향, 응답 대기)
    invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
    
    // 메인 -> 렌더러 (수신)
    on: (channel, callback) => {
        const newCallback = (_, ...args) => callback(...args);
        ipcRenderer.on(channel, newCallback);
        // 클린업 함수 반환
        return () => ipcRenderer.removeListener(channel, newCallback);
    },

    // 메인 -> 렌더러 (한 번만 수신)
    once: (channel, callback) => {
        const newCallback = (_, ...args) => callback(...args);
        ipcRenderer.once(channel, newCallback);
    }
});

