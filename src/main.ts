import './index.html';
import './main.css';

import * as LZString from 'lz-string';
import { BrowserQRCodeReader, VideoInputDevice, BrowserQRCodeSvgWriter, EncodeHintType } from '@zxing/library';






const sampleData = '{"FN":"姓","GN":"名","GENDER":"M","DOB":"20180101","NA":"China","PASSPORT":"1234567890123","FROM":"Hong Kong","VN":"Vehicle Number","DATE":"20181212","INOUTFLAG":"IN","CKLST":53,"DECL":[{"GNAME":"品名/币种","TYPE":"型号","QTY":"数量","AMT":"金额"},{"GNAME":"美金","TYPE":"","QTY":"","AMT":"10000"},{"GNAME":"药品","TYPE":"ABC","QTY":"500g","AMT":"20000"}]}';

const qrcodeWriter = new BrowserQRCodeSvgWriter('outputimg');
const qrcodeReader = new BrowserQRCodeReader();

const enterPressedEvent = new KeyboardEvent('keypress', { key: "Enter" });

var cameraOpened = false;

function encodeToQRCode() {
    let value = (<HTMLInputElement>document.getElementById("inputcode")).value;
    try {
        value = JSON.stringify(JSON.parse(value))
    }
    catch (ex) {
        console.error(ex);
    }

    var binaryStr = LZString.compressToBase64(value);
    document.getElementById("outputcode").textContent = binaryStr;
    document.getElementById("outputimg").innerHTML = '';
    qrcodeWriter.write(binaryStr, 250, 250);
}

function decodeFromInput() {
    let value = (<HTMLInputElement>document.getElementById("scaninput")).value;
    console.log(value);
    let jsonPretty = "不是有效的JSON数据";
    try {
        var decodedData = LZString.decompressFromBase64(value);
        jsonPretty = JSON.stringify(JSON.parse(decodedData), null, '    ');
    }
    catch (ex) {
        console.error(ex);
    }
    let elem_output = document.getElementById("output");
    elem_output.innerHTML = '';
    var lines = jsonPretty.split("\n");
    for (let line of lines) {
        let elem = document.createElement("span");
        elem.textContent = line;
        elem_output.append(elem);
    }
}

document.getElementById("scaninput").addEventListener("keypress", (ev: KeyboardEvent) => {
    if (ev.key == "Enter") {
        event.preventDefault();
        decodeFromInput();
        (<HTMLInputElement>document.getElementById("scaninput")).value = '';
    }
});

document.getElementById("scaninput").addEventListener("focus", ev => {
    (<HTMLInputElement>document.getElementById("scaninput")).value = '';
});

document.getElementById("qrcodeform").addEventListener("submit", ev => {
    ev.preventDefault();
    encodeToQRCode();
    document.getElementById("scaninput").focus();
    return false;
});

document.getElementById("btncamera").addEventListener("click", ev => {
    ev.preventDefault();

    if (cameraOpened) {
        document.querySelector(".video-container").classList.remove("show");
        qrcodeReader.reset();
        cameraOpened = false;
        return;
    } else {
        document.querySelector(".video-container").classList.toggle("show");

        (<HTMLInputElement>document.getElementById("scaninput")).value = '';

        document.getElementById("output").innerHTML = '';

        qrcodeReader.getVideoInputDevices()
            .then(videoInputDevices => {
                videoInputDevices.forEach(
                    device => console.log(`${device.label}, ${device.deviceId}`)
                );
                const firstDeviceId = videoInputDevices[0].deviceId;
                return qrcodeReader.decodeFromInputVideoDevice(firstDeviceId, 'video');
            })
            .then(result => {
                let value = result.getText();
                qrcodeReader.reset();
                (<HTMLInputElement>document.getElementById("scaninput")).value = value;
                document.getElementById("scaninput").dispatchEvent(enterPressedEvent);
                document.querySelector(".video-container").classList.toggle("show");
            })
            .catch(err => console.error(err));

        cameraOpened = true;
    }
});

document.getElementById("inputcode").textContent = sampleData;
encodeToQRCode();
(<HTMLInputElement>document.getElementById("scaninput")).value =
    (<HTMLInputElement>document.getElementById("outputcode")).value;
decodeFromInput();
