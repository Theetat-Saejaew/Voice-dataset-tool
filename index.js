// สำหรับการเข้าถึง Cloud Storage
const admin = require("firebase-admin");
admin.initializeApp();
// สำหรับเช้าถึง Firebase Firestore
const functions = require("firebase-functions");
// สำหรับ network requests
const axios = require("axios");
// Cron Job trigger
const cron = require('node-schedule')
// สำหรับสร้าง public url ใน Cloud Storage
const UUID = require('uuid-v4');

// สำหรับจัดการไฟล์
const path = require('path');
const os = require('os');
const fs = require('fs');



//***important: ให้เอา Channel Access Token xxxx
const LINE_MESSAGING_API = "https://api.line.me/v2/bot";
const LINE_CONTENT_API = "https://api-data.line.me/v2/bot/message";
const LINE_HEADER = {
   "Content-Type": "application/json",
         Authorization: "Bearer xxxx"
};

//Crob Job สำหรับการ Reset ข้อมูลการ check in ของผู้ใช้
exports.ResetNight = functions.pubsub.schedule("0 19 * * mon-sat").timeZone("Asia/Bangkok").onRun(async context => {
  const statusRef = admin.firestore().collection('Status');
  const snapshot =  await statusRef.where('conditions', '==', true).where('shift', '==', 'Night').get();
  
    snapshot.forEach(async(doc)=>{
      await admin.firestore().collection('Status').doc(doc.id).update({
        check_in: 0,
        status: "noAction",
        Today_check_in: "noSuccess",
        timesScript: 0,
        timestamp: [],
        url: []
      })
    })
});

//Crob Job สำหรับการ Reset ข้อมูลการ check in ของผู้ใช้ และทำการบันทึกลง Report เพื่อทำการตรวจสอบ
exports.ResetDay = functions.pubsub.schedule("0 7 * * mon-sat").timeZone("Asia/Bangkok").onRun(async context => {
  const days = (await admin.firestore().collection('Script').doc('countDays').get()).data().numberDay;
  await admin.firestore().collection('Week').doc(`day${days}`).set({
    
  });
  
  
  const updateReport = admin.firestore().collection('Status');
  const updateReportRef = await updateReport.where('Today_check_in', '==', 'Success').get();
  
  updateReportRef.forEach(async(doc) => {
    const userid = doc.data().userId;
    const nameuser = doc.data().nameUser;
    const time1 = doc.data().timestamp[0];
    const time2 = doc.data().timestamp[1];
    const time3 = doc.data().timestamp[2];
    const url1 = doc.data().url[0];
    const url2 = doc.data().url[1];
    const url3 = doc.data().url[2];
    const script1 = doc.data().script[0];
    const script2 = doc.data().script[1];
    const script3 = doc.data().script[2];

    await admin.firestore().collection('Week').doc(`day${days}`).update({
      [userid]: {
        name: nameuser,
        time: [time1, time2, time3],
        url: [url1, url2, url3],
        script: [script1, script2, script3]
      }
      
    }); 
  
    
  })
  
  
  const statusRef = admin.firestore().collection('Status');
  const snapshot =  await statusRef.where('conditions', '==', true).where('shift', '==', 'Day').get();
  
    snapshot.forEach(async(doc)=>{
      await admin.firestore().collection('TEST').doc(doc.id).update({
        check_in: 0,
        status: "noAction",
        Today_check_in: "noSuccess",
        timesScript: 0,
        timestamp: [],
        url: [],
        script: []
      })
    })

    const plusDay =  admin.firestore().collection('Script');
    const Resetsnapshot =  await  plusDay.where('conditions', '==', true).get();
    Resetsnapshot.forEach(async(doc) => {
      await admin.firestore().collection('Script').doc(doc.id).update({
        number: admin.firestore.FieldValue.increment(1)
        
      });    
    })

});


// Cron Job สำหรับการ trigger เรียกใช้ Line Notify ส่ง script ให้ผู้ใช้
exports.Notify = functions.pubsub.schedule("0 */3 * * *").timeZone("Asia/Bangkok").onRun(async context => {
  let randomNumber = Math.floor(Math.random() * 70);
  let defultScript = (await admin.firestore().collection('Script').doc(`script${randomNumber}`).get()).data().messagetext;
  const FieldValue = admin.firestore.FieldValue;
  const statusRef = admin.firestore().collection('Status');
  const snapshot =  await statusRef.where('status', '==', "Action").where('Today_check_in', '==', 'noSuccess').get();
  
  const beginSanpshot = await statusRef.where('status', '==', "noAction").where('timesScript', '==', 0).get();

      snapshot.forEach(async(doc) => {
          let userIdToken = doc.data().TokenId;
          let previousText = doc.data().prepareText;

          lineNotify(userIdToken, previousText);

          await admin.firestore().collection('Status').doc(doc.id).update({
            status: 'noAction',
            timesScript: admin.firestore.FieldValue.increment(1)
            
          });    
      });

      beginSanpshot.forEach(async(doc) => {
          let userIdToken = doc.data().TokenId;
          lineNotify(userIdToken, defultScript);
          await admin.firestore().collection('Status').doc(doc.id).update({
            timesScript: admin.firestore.FieldValue.increment(1),
            prepareText: defultScript

          });
        });
});

//Cron Job สำหรับการ trigger เรียกใช้เพื่อตรวจสอบการส่ง audio ของผู้ใช้
exports.checkReply = functions.pubsub.schedule("*/19 * * * *").timeZone("Asia/Bangkok").onRun(async context => {
  const statusRef = admin.firestore().collection('Status');
  const snapshot =  await statusRef.where('status', '==', "noAction").get(); 
  
    snapshot.forEach(async(doc) => {
        let checktimes = doc.data().timesScript;
        let userIdToken = doc.data().TokenId;
        if(checktimes > 0){
          lineNotify(userIdToken, "คุณยังไม่ได้ส่งข้อความเสียงเพื่อทำการเช็คอิน");
        }
      });
});
//สร้างฟังก์ชันสำหรับรับ Webhook Events จาก LINE
exports.LineWebhook = functions.https.onRequest(async (req, res) => { 
      const FieldValue = admin.firestore.FieldValue;
      let event = req.body.events[0];
      let sourceuserId = `${event.source.userId}`;
      let today = new Date();
      let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

      //เรียกฟังก์ชันเมื่อเข้ามาในรูปแบบข้อความและเข้าเงื่อนไข ทำการบันทึกตัว Token ของผู้ใช้ลงบน Firebase Firestore
      if (event.type === 'message' && event.message.type === 'text' && event.message.text.length === 43 ) { 
        let inputText = event.message.text;
        await admin.firestore().collection('Status').doc(sourceuserId).set({
          prepareText: "",
          userId: `${event.source.userId}`,
          check_in: 0,
          status: "noAction",
          Today_check_in: "noSuccess",
          TokenId: inputText,
          timesScript: 0,
          timestamp: [],
          url: [],
          conditions: true,
          script: []
        });
        reply(event.replyToken, {type: 'text', text: "ทำการบันทึก Token ของคุณเรียบร้อยแล้ว"});

      } 
      //เรียกฟังก์ชันเมื่อเข้ามาในรูปแบบเสียง ทำการ dowload ไปบันทึกไฟล์เสียงลง Cloud Storage และบันทึก รายละเอียดอื่นๆลงใน Firebase Firestore
      else if (event.type === 'message' && event.message.type === 'audio'){

            let nowStatus =  (await admin.firestore().collection('Status').doc(sourceuserId).get()).data().status;
            let userIdToken = (await admin.firestore().collection('Status').doc(sourceuserId).get()).data().TokenId;
            
            if(nowStatus === "noAction"){
              let previousText =  (await admin.firestore().collection('Status').doc(sourceuserId).get()).data().prepareText
              
              const urls = await upload(event, previousText);
              await reply(event.replyToken, { type: "text", text: 'บันทึกการเช็คอินของคุณเรียบร้อยแล้ว'});
              
              await admin.firestore().collection('Status').doc(sourceuserId).update({
                url: admin.firestore.FieldValue.arrayUnion(urls),
                script: admin.firestore.FieldValue.arrayUnion(previousText)
              });

              let randomNumber = Math.floor(Math.random() * 70);
              let msg = (await admin.firestore().collection('Script').doc(`script${randomNumber}`).get()).data().messagetext;
            
              await admin.firestore().collection('Status').doc(sourceuserId).update({
                  prepareText: msg,
                  check_in: admin.firestore.FieldValue.increment(1),
                  status: "Action",
                  timestamp: admin.firestore.FieldValue.arrayUnion(event.timestamp)
              });   

              let count =  (await admin.firestore().collection('Status').doc(sourceuserId).get()).data().check_in;
              if(count === 3){ 
                lineNotify(userIdToken,"วันนี้คุณได้ทำการเช็คอินครบเรียบร้อยแล้ว");
                await admin.firestore().collection('Status').doc(sourceuserId).update({
                  Today_check_in: 'Success'
                })
              }
            } else { lineNotify(userIdToken, "ยังไม่ครบกำหนดเวลาที่ทำการเช็คอินครั้งต่อไป"); }
      } 
      else { reply(event.replyToken, { type: "text", text: "คุณส่งไม่ถูกต้องกรุณาส่งกลับมาใหม่อีกครั้งครับ"}); }
      
      return res.end(); 

  });
   

//ฟังก์ชันสำหรับ upload ไฟล์เสียงลง Cloud Storage และบันทึกรายละเอียดอื่นลง  Firebase Firestore
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
      
   return `${prefix}/${encodeURIComponent(file[0].name)}?${suffix}`
  };


//ฟังก์ชั่นสำหรับ Reply 
const reply = async(replyToken, payload) => {
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
// ฟังชั่นสำหรับการส่ง script ในรูปแบบของ text โดยผ่านส่งการใช้ช่องทาง LINE Notify
const lineNotify = (UserIdToken, msg) => {
      line = require('line-notify-nodejs')(UserIdToken)
      if (msg === "คุณยังไม่ได้ส่งข้อความเสียงเพื่อทำการเช็คอิน" || msg === "วันนี้คุณได้ทำการเช็คอินครบเรียบร้อยแล้ว" || msg === "ยังไม่ครบกำหนดเวลาที่ทำการเช็คอินครั้งต่อไป" )   {
      line.notify({
          message:  msg
      });
    } else {
      line.notify({
        message: "กรุณากดอัดเสียงแล้วพูดคำว่า => " + msg
        }); 
          }
}





