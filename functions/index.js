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

      if (event.message.type === 'text'&& event.message.text.length === 43 ) { 
        let defultScript = await admin.firestore().collection('Script').doc(`script0`).get();
        let defult = defultScript.data().messagetext; 
        
        let inputText = event.message.text;
         await admin.firestore().collection('Users').doc(`${event.source.userId}`).set({
            TokenId: inputText
         });

        await admin.firestore().collection('status').doc(`${event.source.userId}`).set({
          prepareText: defult,
          userId: `${event.source.userId}`,
          check_in: 0,
          Status: "noAction"
        });
        reply(event.replyToken, {type: 'text', text: "ทำการบันทึก Token ของคุณเรียบร้อยแล้ว"})
        lineNotify(inputText, defult);
        // checkReply(userIdToken,`${event.source.userId}`);

      } else if (event.type === 'message' && event.message.type === 'audio'){
            let beforeSc = await admin.firestore().collection('status').doc(`${event.source.userId}`).get();
            let beforeScirpt = beforeSc.data().prepareText;

            const urls = await upload(event, beforeScirpt);
            await reply(event.replyToken, { type: "text", text: urls});

            let randomNumber = Math.floor(Math.random() * 11);
            let script = await admin.firestore().collection('Script').doc(`script${randomNumber}`).get();
            let msg = script.data().messagetext;

            let number = await admin.firestore().collection('status').doc(`${event.source.userId}`).get();
            let count = number.data().check_in;
            
            if(count !== 2){
              count = count + 1;
              await admin.firestore().collection('status').doc(`${event.source.userId}`).update({
                prepareText: msg,
                check_in: count,
                Status: "Action"
              })     
              await countTime(userIdToken, msg, `${event.source.userId}`);
              
              let checkReplyUser = number.data().Status;
              checkReply(userIdToken, checkReplyUser); 

            }else{
              lineNotify(userIdToken,'วันนี้คุณได้ทำการเช็คอินครบเรียบร้อยแล้ว');
            }

            

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
            message: "กรุณากดอัดเสียงแล้วพูดคำว่า => " + msg
      });
}

// exports.Notify = functions.pubsub.schedule("0 */3 * * *").timeZone("Asia/Bangkok").onRun(async context => {
//    lineNotify('1gM977nz4SBICLlaqAopNgP7REUZVtdK59niZ1P6Wjj', "TEST TEST!!!!!!!!!!!!!!!!!!")
// });

const countTime = async(UserIdToken, msg, sourceID) => {
   setTimeout(() => {
      lineNotify(UserIdToken, msg);
      const cityRef = admin.firestore().collection('status').doc(sourceID);
      const res =  cityRef.update({ Status: "noAction"});
  }, 60000);
}

const checkReply = (UserIdToken, checkReplyUser) => {
  setTimeout(() => {
    if(checkReplyUser === 'noAction'){
      lineNotify(UserIdToken, 'คุณยังไม่ได้ทำการเช็คอิน กรุณาอัดกดอัดเสียงตามคำสคริปต์ก่อนหน้าเพื่อเช็คอินด้วยครับ')
    }
  }, 120000);//เช็คทุก 3 นาที
}

