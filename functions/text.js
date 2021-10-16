// const admin = require("firebase-admin");
// admin.initializeApp();
// const functions = require("firebase-functions");
// const axios = require("axios");

// // สำหรับสร้าง public url ใน Cloud Storage
// const UUID = require("uuid-v4");

// // สำหรับจัดการไฟล์
// const path = require("path");
// const os = require("os");
// const fs = require("fs");

// //เก็บ Token ของผู้ใช้รูปแบบ text event
// exports.LineWebhook = functions.https.onRequest(async (req, res) => { 
//     let event = req.body.events[0];
//     let groupId = event.source.groupId;
//     if (event.message.type === 'text') { 
//        let inputText = event.message.text;  
//        await admin.firestore().collection('user').doc(`${event.source.userId}`).set({ 
//          input: inputText })
      
//       .then(function () { 
//          console.log('Document data:', doc.data());
//        }).catch(function (error) { 
//             console.error("Error writing document: ", error); 
//        }); 

//       const price = admin.firestore().collection('sampleData').doc('inspiration');
//       const doc = await price.get();
      
      
//       // if (!doc.exists) {
//       // console.log('No such document!');
//       // } else if (doc.data().author === inputText){
//       //    console.log('Document data:', typeof doc.data().author);
//       // } else {
//       //    console.log('Document data:', doc.data().author);
//       // }
//       // const snapshot = await admin.firestore().collection('users').get();
//       // snapshot.forEach((doc) => {
//       // console.log(doc.id, '=>', doc.data());
      
      
//       push(groupId, doc.data().author)
//      } 
//      return res.end();
//  });
// //ส่งกลับหาผูใช้
// const push = (groupId, msg) => { 
//    return axios({
//    method: "post",
//    url: "https://api.line.me/v2/bot/message/push",
//    headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer Mxdf0uFVUrAbV9zvpaGaZxic2wGs8iXGeBC69PHWzuf+aBiE+nKwPelbibybVmUn82s1yTWmZlz0wvt7wi05vxhVKpWC0LQmb7WxJAK57dGRjxkN4OGfDn9bqIdj6WLNNZQMFQqF0UQKrBEnrRypiQdB04t89/1O/w1cDnyilFU="
//    },
//    data: JSON.stringify({
//       to: groupId,
//       messages: [{ type: "text", text: msg }] 
//    }) 
//   })
// }




// //uploadVoice
//  exports.uploadVoice = functions.https.onRequest(async(req, res) => {
//    const event = req.body.events[0];
//    if (event.type === 'message' && event.message.type === 'audio') {
//      // เรียกฟังก์ชัน upload เมื่อเข้าเงื่อนไข
//      const urls = await upload(event);
     
//      // reply ตัว URL ที่ได้กลับไปยังห้องแชท
//      await reply(event.replyToken, { type: "text", text: urls });
//    }
//    return res.end();
//  });


// const reply = (replyToken, payload) => {
//    axios({
//      method: "post",
//      url: `${LINE_MESSAGING_API}/message/reply`,
//      headers: LINE_HEADER,
//      data: JSON.stringify({
//        replyToken: replyToken,
//        messages: [payload]
//      })
//    })
//  };

//  const upload = async(event) => {
//    const url = `${LINE_CONTENT_API}/${event.message.id}/content`;
//    const buffer = await axios({
//      method: "get",
//      headers: LINE_HEADER,
//      url: url,
//      responseType: "arraybuffer"
//    });
 
//     const filename = `${event.timestamp}.mp3`;
//     const tempLocalFile = path.join(os.tmpdir(), filename); 
//     await fs.writeFileSync(tempLocalFile, buffer.data);
 
//    const uuid = UUID()
 
//    const bucket = admin.storage().bucket()
//    const file = await bucket.upload(tempLocalFile, {
//    // กำหนด path ในการเก็บไฟล์แยกเป็นแต่ละ userId
//      destination: `voice/th/สวัสดีครับ/${filename}`,
//      metadata: {
//        cacheControl: 'no-cache',
//        metadata: {
//          firebaseStorageDownloadTokens: uuid
//      }
//    }
//  })
 
//  fs.unlinkSync(tempLocalFile)
 
//  const prefix = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o`
//  const suffix = `alt=media&token=${uuid}`
//  const back = 'ขอบคุณครับสำหรับไฟล์เสียงครับ'
//  return back
//  // return `${prefix}/${encodeURIComponent(file[0].name)}?${suffix}`
//  };
 






// // //function สำหรับยิง line notify
// // const lineNotify = msg => {
// //    return request({
// //      method: "POST",
// //      uri: "https://notify-api.line.me/api/notify",
// //      headers: {
// //        "Content-Type": "application/x-www-form-urlencoded",
// //        Authorization: "Bearer " + config.notifyToken
// //      },
// //      form: {
// //        message: msg
// //      }
// //    });
// //  };

// const lineNotify = require('line-notify-nodejs')('KONQhrEa9ocg5UNeoXDff6jRnLFFvmqX6GIl3AU3Hov');
 
// lineNotify.notify({
//   message: 'send test',
// }).then(() => {
//   console.log('send completed!');
// });

// exports.Notify = functions.pubsub.schedule("*/2 * * * *").timeZone("Asia/Bangkok").onRun(async context => {
//     const lineNotify = require('line-notify-nodejs')('KONQhrEa9ocg5UNeoXDff6jRnLFFvmqX6GIl3AU3Hov');
//        lineNotify.notify({
//           message: 'send test successful'
//         })
// });












// const admin = require("firebase-admin");
// admin.initializeApp();
// const functions = require("firebase-functions");
// const axios = require("axios");
// const cheerio = require('cheerio');

// // สำหรับสร้าง public url ใน Cloud Storage
// const UUID = require("uuid-v4");

// // สำหรับจัดการไฟล์
// const path = require("path");
// const os = require("os");
// const fs = require("fs");
// const { EEXIST } = require("constants");

// const LINE_MESSAGING_API = "https://api.line.me/v2/bot";
// const LINE_CONTENT_API = "https://api-data.line.me/v2/bot/message";
// const LINE_HEADER = {
//   "Content-Type": "application/json",
//   Authorization: "Bearer Mxdf0uFVUrAbV9zvpaGaZxic2wGs8iXGeBC69PHWzuf+aBiE+nKwPelbibybVmUn82s1yTWmZlz0wvt7wi05vxhVKpWC0LQmb7WxJAK57dGRjxkN4OGfDn9bqIdj6WLNNZQMFQqF0UQKrBEnrRypiQdB04t89/1O/w1cDnyilFU="
// };


// //เก็บ Token ของผู้ใช้รูปแบบ text event
// exports.LineWebhook = functions.https.onRequest(async (req, res) => { 
//     let event = req.body.events[0];
//     let groupId = event.source.groupId;
//     if (event.message.type === 'text') { 
//       let inputText = event.message.text;

//       let script =  await admin.firestore().collection('Script').doc('script0').get();
//       let msg = script.data().messagetext;
    
//       let textToken =  await admin.firestore().collection('Users').doc(`${event.source.userId}`).get();
//       let UserIdToken =  textToken.data().TokenId;
      
//       await admin.firestore().collection('Users').doc(`${event.source.userId}`).set({
//         TokenId: inputText
//       }).then(function () { 
//            console.log('Document successfully written!');
//          }).catch(function (error) { 
//               console.error("Error writing document: ", error); 
//          }); 

//       push(groupId, "ทำการบันทึก Token ของคุณเรียบร้อยแล้วครับ");
      
//       const lineNotify = require('line-notify-nodejs')(UserIdToken);
//       lineNotify.notify({
//         message: msg 
//         });
      
//       // const lineNotify = require('line-notify-nodejs')(doc);
//       //     lineNotify.notify({
//       //       message: msg
//       //       });
            


//       // let snapshot =  admin.firestore().collection('user');
//       // let doc = await snapshot.get()
//       // .then(function () {
//       //   console.log('Document successfully written!', doc.docs.data());
//       // })
//       // push(groupId, doc.data().scripts)
//       // // function สำหรับยิง line notify

//       //  const lineNotify = require('line-notify-nodejs')('KONQhrEa9ocg5UNeoXDff6jRnLFFvmqX6GIl3AU3Hov');
//       //  lineNotify.notify({
//       //     message: 'send test successful'
//       //   })

//       // await admin.firestore().collection('user').doc(`${event.source.userId}`).set({ 
//       //    TokenId: inputText })
//       // .then(function () { 
//       //    console.log('Document data:', doc.data());
//       //  }).catch(function (error) { 
//       //       console.error("Error writing document: ", error); 
//       //  }); 

   
//       // let doc = await price.get();
//       // push(groupId, doc.data().author)
//       // push(groupId, snapshot.data());
//     }

//     if(event.type === 'message' && event.message.type === 'audio'){
//       // เรียกฟังก์ชัน upload เมื่อเข้าเงื่อนไข
//     const urls = await upload(event);
    
//     // reply ตัว URL ที่ได้กลับไปยังห้องแชท
//     await reply(event.replyToken, { type: "text", text: urls });
//     } 
//     return res.end();
// });
      
//       // if (!doc.exists) {
//       // console.log('No such document!');
//       // } else if (doc.data().author === inputText){
//       //    console.log('Document data:', typeof doc.data().author);
//       // } else {
//       //    console.log('Document data:', doc.data().author);
//       // }
//       // const snapshot = await admin.firestore().collection('users').get();
//       // snapshot.forEach((doc) => {
//       // console.log(doc.id, '=>', doc.data());
      


// //  const lineNotify = require('line-notify-nodejs')(doc);
// //           lineNotify.notify({
// //             message: [{ type: "text", text: msg }] 
// //             });
            

 
// //ส่งกลับหาผูใช้ push และ reply ใช้ได้ทั้งคู่
// const push = (groupId, msg) => { 
//    return axios({
//    method: "post",
//    url: "https://api.line.me/v2/bot/message/push",
//    headers: {
//       "Content-Type": "application/json",
//       Authorization: "Bearer Mxdf0uFVUrAbV9zvpaGaZxic2wGs8iXGeBC69PHWzuf+aBiE+nKwPelbibybVmUn82s1yTWmZlz0wvt7wi05vxhVKpWC0LQmb7WxJAK57dGRjxkN4OGfDn9bqIdj6WLNNZQMFQqF0UQKrBEnrRypiQdB04t89/1O/w1cDnyilFU="
//    },
//    data: JSON.stringify({
//       to: groupId,
//       messages: [{ type: "text", text: msg }] 
//    }) 
//   })
// }

// const reply = (replyToken, payload) => {
//    axios({
//      method: "post",
//      url: `${LINE_MESSAGING_API}/message/reply`,
//      headers: LINE_HEADER,
//      data: JSON.stringify({
//        replyToken: replyToken,
//        messages: [payload]
//      })
//    })
//  };

// const upload = async(event) => {
//     const url = `${LINE_CONTENT_API}/${event.message.id}/content`;
//     const buffer = await axios({
//       method: "get",
//       headers: LINE_HEADER,
//       url: url,
//       responseType: "arraybuffer"
//     });
 
//     const filename = `${event.timestamp}.mp3`;
//     const tempLocalFile = path.join(os.tmpdir(), filename); 
//     await fs.writeFileSync(tempLocalFile, buffer.data);
  
//     const uuid = UUID()
  
//     const bucket = admin.storage().bucket()
//     const file = await bucket.upload(tempLocalFile, {
//     // กำหนด path ในการเก็บไฟล์แยกเป็นแต่ละ userId
//       destination: `voice/th/สวัสดีครับ/${filename}`,
//       metadata: {
//         cacheControl: 'no-cache',
//         metadata: {
//           firebaseStorageDownloadTokens: uuid
//               }
//             }
//           })
 
//     fs.unlinkSync(tempLocalFile)
 
//     const prefix = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o`
//     const suffix = `alt=media&token=${uuid}`
//     const back = 'ขอบคุณครับสำหรับไฟล์เสียงครับ'
//     return back
//  // return `${prefix}/${encodeURIComponent(file[0].name)}?${suffix}`
// };
 

// exports.Notify = functions.pubsub.schedule("*/1 * * * *").timeZone("Asia/Bangkok").onRun(async context => {
  

  // let script =  await admin.firestore().collection('Script').doc('script0').get();
  // let msg = script.data().messagetext;

  // let textToken =  await admin.firestore().collection('Users').doc(`${event.source.userId}`).get();
  // let doc =  textToken.data().TokenId;
  

//   const lineNotify = require('line-notify-nodejs')('X5ulAP0L9YN5gYRz0rI413jkKSkHKjCds8awhXaa2vp');
//     lineNotify.notify({
//       message: 'send test successful'
//       })

// });
// exports.Notify = functions.pubsub.schedule("*/1 * * * *").timeZone("Asia/Bangkok").onRun(async context => {
//   const lineNotify = require('line-notify-nodejs')('X5ulAP0L9YN5gYRz0rI413jkKSkHKjCds8awhXaa2vp');
//      lineNotify.notify({
//         message: 'send test successful'
//       })
// });

let a = 0;
if(a === 0){
  a += 1;
  console.log(a);
}else{
  console.log('gello')
}
