// main.js

// main.js

const { app, BrowserWindow, ipcMain, dialog, Menu, Notification } = require('electron');
const path = require('path');
const { fork } = require('child_process');
const fs = require('fs');
const os = require('os');

// 임시 파일 및 처리된 파일을 저장할 디렉토리 설정
const workDir = path.join(os.tmpdir(), 'pptx-surgeon-work');
if (!fs.existsSync(workDir)) {
  fs.mkdirSync(workDir);
}

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // 보안을 위해 false 유지
      contextIsolation: true, // 보안을 위해 true 유지
    }
  });

  mainWindow.loadFile('public/index.html');

  // 개발자 도구를 엽니다.
  // mainWindow.webContents.openDevTools();
}

// 실시간 로그를 UI로 전송하는 함수
function sendToUI(channel, data) {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(channel, data);
    }
}

app.whenReady().then(() => {
  createWindow();

  // 애플리케이션 메뉴 설정
  const menu = Menu.buildFromTemplate(getMenuTemplate());
  Menu.setApplicationMenu(menu);

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
    // 앱 종료 시 임시 디렉토리 정리
    if (fs.existsSync(workDir)) {
        fs.rmSync(workDir, { recursive: true, force: true });
    }
    if (process.platform !== 'darwin') app.quit();
});

// --- IPC 핸들러: 렌더러 프로세스와의 통신 ---

// 파일 열기 로직을 별도 함수로 분리 (IPC와 메뉴에서 공유)
async function handleOpenFileRequest() {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            { name: 'PowerPoint Files', extensions: ['pptx'] }
        ]
    });
    if (canceled || !filePaths || filePaths.length === 0) {
        return null;
    }
    const filePath = filePaths[0];
    const uniqueName = `${Date.now()}-${path.basename(filePath)}`;
    const newPath = path.join(workDir, uniqueName);
    fs.copyFileSync(filePath, newPath);
    return { path: newPath, name: path.basename(filePath) };
}

// 기존 파일 선택 대화상자 핸들러를 새 함수 호출로 변경
ipcMain.handle('dialog:openFile', handleOpenFileRequest);

// 폰트 정보 분석 실행
ipcMain.handle('run:analyze', async (event, filePath) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filePath)) {
            return reject(new Error('File not found at ' + filePath));
        }

        sendToUI('update:progress', { message: 'Analyzing font information...', progress: 20 });

        const child = fork(path.join(__dirname, 'pptx-surgeon.js'), ['-d', filePath], { silent: true });
        let output = '';
        let error = '';

        child.stdout.on('data', (data) => { output += data.toString(); });
        child.stderr.on('data', (data) => { error += data.toString(); });

        child.on('close', (code) => {
            if (code === 0) {
                sendToUI('update:progress', { message: 'Analysis complete!', progress: 100 });
                resolve({ success: true, analysis: output });
            } else {
                sendToUI('update:error', { message: 'Analysis failed' });
                reject(new Error(error || 'Analysis failed'));
            }
        });
    });
});

// 폰트 수술 실행
ipcMain.handle('run:process', async (event, { filePath, originalName, options }) => {
    return new Promise((resolve, reject) => {
        const outputFileName = 'nice_' + originalName;
        const outputPath = path.join(workDir, outputFileName);

        if (!fs.existsSync(filePath)) {
            return reject(new Error('File not found'));
        }

        const args = [];
        if (options.verbose) args.push('-v', '2');
        if (options.removeEmbed) args.push('-r');
        if (options.fontMappings && options.fontMappings.length > 0) {
            options.fontMappings.forEach(mapping => {
                if (mapping.from && mapping.to) args.push('-m', `${mapping.from}=${mapping.to}`);
            });
        }
        if (options.fontCleanup) args.push('-c', options.fontCleanup);
        args.push('-o', outputPath, filePath);

        sendToUI('update:progress', { message: 'Starting font surgery...', progress: 10 });

        const child = fork(path.join(__dirname, 'pptx-surgeon.js'), args, { silent: true });

        child.stdout.on('data', (data) => {
            sendToUI('update:verbose', { message: data.toString().trim() });
        });
        child.stderr.on('data', (data) => {
            sendToUI('update:verbose', { message: `ERROR: ${data.toString().trim()}` });
        });

        child.on('close', (code) => {
            if (code === 0) {
                sendToUI('update:progress', { message: 'Surgery complete!', progress: 100 });
                new Notification({
                    title: '수술 완료',
                    body: `${originalName} 파일의 폰트 문제가 성공적으로 해결되었습니다.`
                }).show();
                resolve({ success: true, outputPath });
            } else {
                sendToUI('update:error', { message: 'Surgery failed' });
                reject(new Error('Processing failed'));
            }
        });
    });
});

// 결과 파일 저장
ipcMain.handle('dialog:saveFile', async (event, sourcePath) => {
    const originalName = path.basename(sourcePath);
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
        title: 'Save Processed File',
        defaultPath: originalName,
        filters: [{ name: 'PowerPoint Files', extensions: ['pptx'] }]
    });

    if (canceled || !filePath) {
        return null;
    } else {
        fs.copyFileSync(sourcePath, filePath);
        return filePath;
    }
});

