const functions = require('firebase-functions')

// สำหรับการเข้าถึง Cloud Storage
const admin = require("firebase-admin");
admin.initializeApp();

// สำหรับ network requests
const axios = require('axios');

// สำหรับสร้าง public url ใน Cloud Storage
const UUID = require("uuid-v4");

// สำหรับจัดการไฟล์
const path = require("path");
const os = require("os");
const fs = require("fs");

const LINE_MESSAGING_API = "https://api.line.me/v2/bot";
const LINE_CONTENT_API = "https://api-data.line.me/v2/bot/message";
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: "Bearer J6JoYsTe696F2vy/EaRRWWMDqGo8jtT65B5dKIfPP6RUHzEAGMiQ/zmXbHcCMRIViYlyMJVpoynncZZW98hNiO14zekvIybSkcpJcLfGoKLovU5/Tx9PyuS4Ja94kMY2cszpZ/yS5kDoCSVR1RyU6wdB04t89/1O/w1cDnyilFU="
};


exports.uploadVoice = functions.https.onRequest(async(req, res) => {
  const event = req.body.events[0];
  if (event.type === 'message' && event.message.type === 'audio') {
    // เรียกฟังก์ชัน upload เมื่อเข้าเงื่อนไข
    const urls = await upload(event);
    
    // reply ตัว URL ที่ได้กลับไปยังห้องแชท
    await reply(event.replyToken, { type: "text", text: urls });
  }
  return res.end();
});

const reply = (replyToken, payload) => {
  axios({
    method: "post",
    url: `${LINE_MESSAGING_API}/message/reply`,
    headers: LINE_HEADER,
    data: JSON.stringify({
      replyToken: replyToken,
      messages: [payload]
    })
  })
};

const upload = async(event) => {
  const url = `${LINE_CONTENT_API}/${event.message.id}/content`;
  const buffer = await axios({
    method: "get",
    headers: LINE_HEADER,
    url: url,
    responseType: "arraybuffer"
  });

  const filename = `${event.timestamp}.mp3`;
  const tempLocalFile = path.join(os.tmpdir(), filename);
  await fs.writeFileSync(tempLocalFile, buffer.data);

  const uuid = UUID()

  const bucket = admin.storage().bucket()
  const file = await bucket.upload(tempLocalFile, {
  // กำหนด path ในการเก็บไฟล์แยกเป็นแต่ละ userId
    destination: `voice/${event.source.userId}/${filename}`,
    metadata: {
      cacheControl: 'no-cache',
      metadata: {
        firebaseStorageDownloadTokens: uuid
    }
  }
})

fs.unlinkSync(tempLocalFile)

const prefix = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o`
const suffix = `alt=media&token=${uuid}`
return `${prefix}/${encodeURIComponent(file[0].name)}?${suffix}`
};

