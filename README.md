const admin = require("firebase-admin");
admin.initializeApp();
const functions = require("firebase-functions");
const axios = require("axios");

// สำหรับสร้าง public url ใน Cloud Storage
const UUID = require('uuid-v4');

// สำหรับจัดการไฟล์
const path = require('path');
const os = require('os');
const fs = require('fs');



const LINE_MESSAGING_API = "https://api.line.me/v2/bot";
const LINE_CONTENT_API = "https://api-data.line.me/v2/bot/message";
const LINE_HEADER = {
   "Content-Type": "application/json",
         Authorization: "Bearer QVzLwmlOsAS5LzOHWlgNRFnR6zOFN3hA976szWLvnyP+6nmpJOxxORjwkFFQN0ojD932A6CrR0lo8QWipedCB+6gpl4fThqmvBPb1IMUJNClN/M6s5Mt1YjmdRHqrfR5qDjooUCiHeLOjJvM6zjcfAdB04t89/1O/w1cDnyilFU="
};



exports.LineWebhook = functions.https.onRequest(async (req, res) => { 
      let event = req.body.events[0];

      let textToken = await admin.firestore().collection('Users').doc(`${event.source.userId}`).get();
      let userIdToken = textToken.data().TokenId;

      if (event.message.type === 'text' && event.message.text.length === 43) { 
        let defultScript = await admin.firestore().collection('Script').doc(`script0`).get();
        let defult = defultScript.data().messagetext; 
        
        let inputText = event.message.text;
         await admin.firestore().collection('Users').doc(`${event.source.userId}`).set({
            TokenId: inputText
         });

        reply(event.replyToken, {type: 'text', text: "ทำการบันทึก Token ของคุณเรียบร้อยแล้ว"})
       
        lineNotify(inputText, defult);

        await admin.firestore().collection('status').doc(`${event.source.userId}`).set({
          prepareText: defult
        });

      } else if (event.type === 'message' && event.message.type === 'audio'){
            // const urls = await upload(event, msg);
            let beforeSc = await admin.firestore().collection('status').doc(`${event.source.userId}`).get();
            let beforeScirpt = beforeSc.data().prepareText;

            const urls = await upload(event, beforeScirpt);
            await reply(event.replyToken, { type: "text", text: urls});

            let randomNumber = Math.floor(Math.random() * 11);
            let script = await admin.firestore().collection('Script').doc(`script${randomNumber}`).get();
            let msg = script.data().messagetext;

            await admin.firestore().collection('status').doc(`${event.source.userId}`).set({
              prepareText: msg
            });

            await countTime(userIdToken, msg);

      } else {
            reply(event.replyToken, { type: "text", text: "กรุณาส่งกลับมาใหม่อีกครั้งครับ"});
      }
       

      return res.end(); 
   });


const upload = async(event, msg) => {
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
        destination: `voice/th/${msg}/${filename}`,
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
      const addressURL = `${prefix}/${encodeURIComponent(file[0].name)}?${suffix}`;

      const backToUsers = 'ขอบคุณครับสำหรับไฟล์เสียงครับ';

      //await reply(event.replyToken, { type: "text", text: backToUsers});

      
      return backToUsers
   // return `${prefix}/${encodeURIComponent(file[0].name)}?${suffix}`
  };



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

const lineNotify = (UserIdToken, msg) => {
      line = require('line-notify-nodejs')(UserIdToken)
      line.notify({
            message: "กรุณากดอัดเสียงแล้วพูดคำว่า: " + msg
      });
}

// exports.Notify = functions.pubsub.schedule("0 */3 * * *").timeZone("Asia/Bangkok").onRun(async context => {
   
// });

const countTime = (UserIdToken, msg) => {
   setTimeout(() => {
      lineNotify(UserIdToken, msg)
  }, 300000);
}
