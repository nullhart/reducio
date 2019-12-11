const {
    app,
    Menu,
    Tray,
    BrowserWindow,
    ipcMain
} = require('electron')

const fs = require('fs');

const { execSync } = require('child_process')


let dropWindow = null
let tray = null
app.on('ready', () => {
    tray = new Tray('./icon.ico')
    // const contextMenu = Menu.buildFromTemplate([
    //     { label: 'Item1', type: 'radio' },
    //     { label: 'Item2', type: 'radio' },
    //     { label: 'Item3', type: 'radio', checked: true },
    //     { label: 'Item4', type: 'radio' }
    // ])
    tray.setToolTip('This is my application.')
    // tray.setContextMenu(contextMenu)

    ipcMain.on('filePath', async (event, arg) => {



        try {
            await execSync(`${__dirname}/cwebp_binary/cwebp.exe -q 100 "${arg.path}" -o "${require('path').dirname(arg.path)}\\${arg.name.split(".")[0]}.webp"`);
            event.returnValue = true
        } catch (error) {
            event.returnValue = false
        }


        console.log('converted')
        event.returnValue = true
    })

    dropWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        titleBarStyle: 'hiddenInset',
        frame: false,
        width: 250,
        height: 400,
        show: false,
        transparent: true
    })


    dropWindow.loadFile(`./index.html`)


    const {
        x,
        y
    } = tray.getBounds()
    dropWindow.setPosition(x - 125, y - 420, false)


    tray.on('click', function () {
        const {
            x,
            y
        } = tray.getBounds()
        dropWindow.setPosition(x - 120, y - 420, false)

        if (dropWindow.isVisible() == false) {
            dropWindow.show();
        } else {
            dropWindow.hide();
        }

    });


})