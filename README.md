# ขั้นตอน
# 1. สร้าง Provider และ Channel
## สมัครเป็น LINE Developer
จุดเริ่มขบวนสำหรับการพัฒนาแอปพลิเคชันต่างๆบนแพลตฟอร์มของ LINE คือคุณจะต้องสมัครเป็น LINE Developer ก่อน

1. เข้าไปที่ https://developers.line.biz/console/ แล้วเลือก Log in with LINE account(สีเขียว) เพื่อเข้าสู่ระบบ
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2Fa95a26331ae450d5.png?alt=media&token=07435857-361d-4aa1-a302-097432ca06e0)

2. เข้าสู่ระบบด้วยบัญชี LINE ของคุณให้เรียบร้อย

3. กรอกชื่อและอีเมล พร้อมกดยอมรับ Agreement จากนั้นกดปุ่ม Create my account เป็นอันเสร็จสิ้นขั้นตอนการสมัครเป็น LINE Developer
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2F5e1b438d1b736839.png?alt=media&token=ef8c73f3-2412-4f58-953d-cb6c21201bb9)

## สร้าง Provider
Provider คือชื่อผู้ให้บริการ ซึ่งจะไปแสดงตามหน้า consent ต่างๆ หรือเรียกได้ว่าเป็น superset ของแอปทั้งหลายที่เราจะพัฒนาขึ้นรวมถึง LIFF app ด้วย โดยการสร้างเพียงให้ระบุชื่อของ Provider ลงไป ซึ่งอาจจะตั้งเป็นชื่อตัวเอง, ชื่อบริษัท, ชื่อทีม หรือชื่อกลุ่มก็ได้
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2F5125ddf1597b699c.png?alt=media&token=e830b803-197e-406e-9b63-a89fd5be623d)
> Remember: 1 Account สามารถมี Provider สูงสุดได้ 10 Providers และไม่สามารถมีคำว่า LINE ในชื่อ Provider ได้

## สร้าง Channel
Channel เปรียบเสมือนแอป หรือเรียกได้ว่าเป็น subset ของ Provider โดยมีอยู่ 3 รูปแบบ คือ LINE Login, Messaging API และ Clova Skill
1. สำหรับการพัฒนา Chatbot เราจะต้องเลือก Create a Messaging API channel
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2Fe272bb75cb230a46.png?alt=media&token=b48823c9-8cfa-4765-a830-a27bb1ce5b79)

2.เมื่อกดเลือก Messaging API channel จะเข้าสู่หน้าที่ให้ระบุรายละเอียดต่างๆลงไป แล้วกดสร้าง
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2F803ec58fa1f5d56f.png?alt=media&token=d180bfc1-add9-4c83-8a9f-3177ce11fc79)
> Note: ส่วนของ Privacy Policy และ Terms of Use สามารถระบุภายหลังได้

## เพิ่ม Chatbot เป็นเพื่อนและตั้งค่า Channel
1.หลังจากกดสร้าง Channel แล้ว ให้ไปที่ Tab ชื่อ Messaging API และทำการแสกน QR code ด้วยแอป LINE เพื่อเพิ่ม Chatbot เป็นเพื่อน
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2F3b5f55dee51c7ee3.png?alt=media&token=95533089-aaa1-4462-9cda-ac3067ccd67d)

2.ให้ปิด Auto-reply messages เนื่องจากฟีเจอร์นี้จะเป็น default การตอบกลับของ Chatbot ซึ่งไม่จำเป็นต้องใช้ฟีเจอร์นี้
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2F3bc3ff782e1f419f.png?alt=media&token=c37b6fa2-f77d-404b-9e15-719186540748)

![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2Ffedf0234e1e7db99.png?alt=media&token=2cfd7ab7-c2aa-4af2-9630-f89f1991e416) 

3.กลับมาที่ Channel ที่เราสร้างใน Tab ชื่อ Messaging API ตรงส่วนของ Channel access token ให้กดปุ่ม Issue
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2Fd90e21f7bea332b9.png?alt=media&token=ac91e83c-64b2-4dba-b706-36925d7cd8ce)
> Important: ตัว Channel Access Token คือกุญแจสำคัญในการใช้งาน Messaging API ดังนั้นให้เก็บรักษาไว้ให้ดี

# 2.สร้างและตั้งค่าโปรเจคใน Firebase
เบื้องหลังของ Chatbot ตัวนี้ เราจะใช้บริการใน Firebase อย่าง Cloud Functions for Firebase, Cloud Storage for Firebase , Firebase firestore ดังนั้นขั้นตอนนี้เราจะมาสร้างโปรเจค Firebase เพื่อใช้งานกัน
## สร้างโปรเจคใน Firebase
1. ให้ Sign in ใน Firebase console ด้วย Google account
2. ในหน้า Firebase console ให้คลิก Add project จากนั้นตั้งชื่อโปรเจคตามต้องการ
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2FUntitled.jpg?alt=media&token=75c7d60f-16e9-42ab-a1ed-8738272f2dda)

3. เมื่อกด Continue แล้วให้ข้ามการตั้งค่า Google Analytics ไป เพราะคุณจะไม่ได้ใช้มันในโปรเจคนี้ 
## เปลี่ยนแพลนจาก Spark ไปเป็น Blaze (Pay as you go)
เนื่องจาก Cloud Functions for Firebase มีเงื่อนไขว่า หากต้องการไป request ตัว APIs ที่อยู่ภายนอก Google คุณจำเป็นจะต้องใช้ Blaze plan(เราจะต้องไปเรียก Messaging API ของ LINE)
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2F586ef5693b304c15.png?alt=media&token=7683ad6a-10b4-411b-b637-c71e48e0030a)
-Note: เมื่อคุณเปลี่ยนมาใช้ Blaze plan นอกจากที่คุณจะสามารถ request ตัว APIs ที่อยู่ภายนอก Google ได้แล้ว คุณยังจะได้โค้วต้าในการเรียกใช้งานฟังก์ชันฟรี 2,000,000 ครั้ง/เดือน

## เปิดใช้งาน Cloud Storage for Firebase
1. ในหน้าโปรเจคที่เราสร้างจะเลือกเมนูชื่อ Storage ที่อยู่ทางซ้ายมือ
2. ในหน้า Cloud Storage for Firebase ให้คลิก Get started
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2F690640db362b45e4.png?alt=media&token=9c321486-ec82-4221-b045-dfcd7a1b1c7d)

3. Popup ของ Default ของ Security Rules จะแสดงขึ้นมา แล้วก็ให้เรากด Next ไป 
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2F891ff49c955af8b8.png?alt=media&token=c598f655-bbda-4d9e-8355-1164ebe2c48a)
4. เลือก Location ของ Cloud Storage ที่ต้องการ แล้วกด Done
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2F475f4bdbd8e2dae6.png?alt=media&token=aded2159-265a-4e33-93fd-01ef2c4120f8)
> ---Remember: Location ที่คุณเลือกในขั้นตอนนี้ จะไม่สามารถเปลี่ยนแปลงได้ในภายหลัง

## เปิดใช้งาน Cloud Firestore
Cloud Firestore โดยเมื่อมีข้อความเข้ามาใน database มันจะทำการแปลภาษาตามที่เราตั้งค่าไว้ ดังนั้นให้เราจะมาเปิดใช้งาน database ตัวนี้
1.ในหน้าโปรเจคให้เลือกเมนูชื่อ Firestore Database ที่อยู่ทางซ้ายมือ

2.ในหน้า Cloud Firestore ให้คลิก Create database
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2F5905f3594f353eed.png?alt=media&token=e92bc104-d792-48c4-bd81-fba14f30a83e)

3.ให้เลือก Test mode เพื่อให้ client สามารถเขียนและอ่านข้อมูลได้(แต่จะเขียนและอ่านได้ก็ต่อเมื่อเข้าเงื่อนไขใน backend และ flow ที่เราทำการออกแบบไว้เท่านั้น)
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2FUntitled1.jpg?alt=media&token=516b6947-d657-429c-bfde-455fd1baa960)

4.เลือก location ของ database แล้วคลิก Enable
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2F32f815f4648c3174.png?alt=media&token=670da62a-2761-4e1c-93ef-e0e057506dcf)

# 3.ติดตั้ง Firebase CLI และ Cloud Functions for Firebase
## การติดตั้ง Firebase CLI
Firebase CLI เป็นเครื่องมือที่จำเป็นสำหรับการ deploy ตัวฟังก์ชันที่เราพัฒนาขึ้น อีกทั้งยังสามารถจำลองการทำงานฟังก์ชัน(Emulate) ภายในเครื่องที่เราพัฒนาอยู่(Locally) ได้
Note: การติดตั้ง Firebase CLI เราจะต้องมี npm ในเครื่องซะก่อน โดยหากคุณยังไม่มี แนะนำให้ติดตั้งผ่าน Node.js

1. เปิด Terminal ขึ้นมาแล้ว run คำสั่ง
```
npm install -g firebase-tools
```
2. ตรวจสอบว่า Firebase CLI ได้ติดตั้งเรียบร้อยแล้วโดย run คำสั่ง (หากสำเร็จจะเห็นเลขเวอร์ชัน)
```
firebase --version
```
## Initialize โปรเจค
1. รันคำสั่งนี้ จากนั้นตัว browser จะเปิดขึ้นมาให้เราเข้าสู้ระบบด้วย Google account เดียวกันกับที่สร้างโปรดจคใน Firebase
```
firebase login
```
2. สร้างโฟลเดอร์เปล่า(ตัวอย่างโฟลเดอร์ชื่อ bot) แล้วให้ shell เข้าไปในนั้น
```
mkdir bot
cd bot
```
3. เมื่อเข้ามาในโฟลเดอร์แล้ว ให้ Initial โปรเจคด้วยคำสั่ง
```
firebase init functions
```
4. เลือก Use an existing project จากนั้นจะเห็นเชื่อโปรเจคที่เราสร้างไว้ ก็กด enter ต่อไป
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2F40a0770125b530e5.png?alt=media&token=6e905fa4-b00d-4232-ae44-74ee11bf09cf)

5. ถัดไปจะมีตัวเลือกภาษา 2 ตัวคือ JavaScript และ TypeScript โดยตัวอย่างนี้ให้เลือก JavaScript
6. จากนั้นมันจะถามว่าจะให้ติดตั้ง ESLint ไหม ตรงนี้แนะนำให้ตอบ N ไปก่อน(สำหรับมือใหม่)
7. สุดท้ายมันจะถามว่าจะให้ติดตั้ง dependencies เลยไหมก็ให้ตอบว่า Y ไป
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2F22d3c5ca6c3e32dd.png?alt=media&token=b742ff27-969f-4281-8a11-3110e45a508d)

# 4.สร้างฟังก์ชันสำหรับรับรูปภาพ และตอบกลับผ่าน LINE
## เพิ่ม Dependencies ที่จำเป็นสำหรับโปรเจคนี้
1. ในโฟลเดอร์ functions ให้เปิดไฟล์ package.json ขี้นมา
2. เพิ่ม axios และ cheerio ลงไปใน dependencies
```
"dependencies": {
  "firebase-admin": "^9.7.0",
  "firebase-functions": "^3.13.2",
  "axios": "^0.21.1",
  "uuid-v4": "^0.1.0"
}
```
3. ใน Terminal ให้เรา shell เข้าไปในโฟลเดอร์ชื่อ functions จากนั้น install ตัว dependencies ที่เพิ่มเข้ามาใหม่ด้วยคำสั่ง
```
npm install
```
4. เปิดไฟล์ index.js แล้วเริ่มจากการ import ตัว dependencies ต่างๆเข้ามา
```
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
```
## สร้างฟังก์ชันสำหรับรับ Webhook Events จาก LINE
1. หลังจากเพิ่ม dependencies ในไฟล์ index.js แล้ว ให้ประกาศตัวแปรที่จำเป็นลงไปดังนี้
```
const LINE_MESSAGING_API = "https://api.line.me/v2/bot";
const LINE_CONTENT_API = "https://api-data.line.me/v2/bot/message";
const LINE_HEADER = {
  "Content-Type": "application/json",
  Authorization: "Bearer xxxxx"
};
```
> Important: ให้เอา Channel Access Token ที่ได้จากขั้นตอนที่ 2(สร้าง Provider และ Channel) ไปแทนที่ xxxxx

2. ถัดไปให้สร้างฟังก์ชันชื่อ LineWebhook ในไฟล์ index.js โดยภายในฟังก์ชันให้เขียนเงื่อนไขเพื่อรับ Webhook event จาก LINE ซึ่งเราจะสนใจเฉพาะกรณีที่ผู้ใช้อัพโหลด audio เข้ามาและ Token ของ Line Notify เท่านั้น
  และเมื่อบันทึก Token จาก Line Notify แล้วจะทำการเซ็ตค่าเริ่มต้นให้ผู้ใช้
```
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
    
    // reply ตัว URL ที่ได้กลับไปยังห้องแชท
     else { reply(event.replyToken, { type: "text", text: "คุณส่งไม่ถูกต้องกรุณาส่งกลับมาใหม่อีกครั้งครับ"}); }
     return res.end(); 
});
```
3. ที่บรรทัดสุดท้ายของไฟล์ index.js ให้เพิ่มฟังก์ชัน reply() เพื่อส่ง URL ที่ได้จากการอัพโหลดกลับไปยังห้องแชท และ ฟังก์ชั่นสำหรับ Line Notify ที่ใช้ในการส่ง script ให้ผู้ใช้
```
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
 
 const lineNotify = (UserIdToken, msg) => {
      line = require('line-notify-nodejs')(UserIdToken)
      if (msg === "คุณยังไม่ได้ส่งข้อความเสียงเพื่อทำการเช็คอิน" || 
      msg === "วันนี้คุณได้ทำการเช็คอินครบเรียบร้อยแล้ว" || 
      msg === "ยังไม่ครบกำหนดเวลาที่ทำการเช็คอินครั้งต่อไป" )   {
      line.notify({
          message:  msg
      });
    } else {
      line.notify({
        message: "กรุณากดอัดเสียงแล้วพูดคำว่า => " + msg
        }); 
          }
}
```

# 5.การอัพโหลดรูปขึ้นไปเก็บบน Cloud Storage for Firebase
1. ให้เพิ่มฟังก์ชัน upload() ที่บรรทัดล่างสุดของไฟล์ index.js
```
const upload = async(event) => {
};
```
2. ภายในฟังก์ชัน upload() ให้เพิ่มโค้ดสำหรับการดาวน์โหลด binary ของไฟล์ที่ผู้ใช้ส่งผ่าน LINE เข้ามา
```
const upload = async(event, msg) => {
      const url = `${LINE_CONTENT_API}/${event.message.id}/content`;
      const buffer = await axios({
        method: "get",
        headers: LINE_HEADER,
        url: url,
        responseType: "arraybuffer"
      });
```
3. ถัดจากโค้ดการดาวน์โหลด binary ให้เพิ่มโค้ดสำหรับสร้างไฟล์ temp ใน local โดยใช้ timestamp ที่ได้จาก Webhook event เป็นชื่อไฟล์
```
const filename = `${event.timestamp}.mp3`;
const tempLocalFile = path.join(os.tmpdir(), filename); 
await fs.writeFileSync(tempLocalFile, buffer.data);
```
4. ต่อจากโค้ดด้านบนให้เเพิ่มโค้ดเพื่อ generate ค่า UUID มาเก็บไว้
```
const uuid = UUID()
```
5. ต่อจากโค้ดด้านบน ให้เพิ่มโค้ดเพื่ออัพโหลดไฟล์ขึ้น Cloud Storage for Firebase
```
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
```
6. ต่อจากโค้ดด้านบน ให้เพิ่มคำสั่งลบไฟล์ temp เมื่ออัพโหลดเรียบร้อย
```
fs.unlinkSync(tempLocalFile)
```
7. ท้ายสุดในฟังก์ชัน upload() ให้สร้าง download url ขึ้นมา แล้ว return ออกไป
```
const prefix = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o`
const suffix = `alt=media&token=${uuid}`
return `${prefix}/${encodeURIComponent(file[0].name)}?${suffix}`
```
# 6.สร้างฟังชั่นสำหรับส่ง script และ สร้างฟังก์ชันสำหรับตั้งเวลาด้วย Cloud Scheduler (Cron Job)
โดยฟังก์ชันดังกล่าวจะเป็นแบบที่สามารถตั้งเวลาให้ทำงานอัตโนมัติได้ ซึ่งในตัวอย่างนี้จะตั้งเวลาให้ฟังก์ชันทำงานชั่วโมงละครั้ง เนื่องจากราคาทองอัพเดททั้งวัน แต่ก็ไม่ได้อัพเดทถี่ระดับนาที
โดยเราจะให้ส่ง script ให้ผู้ทดลองทุก 3 ชั่วโมง โดยใน 1 วันจะส่งทั้งหมด 3 ครั้ง เมื่อส่งแล้วจะมีการตรวจทุก 19 นาทีว่าทำการส่งแล้วหรือยัง ถ้าไม่ได้ทำการส่งจะมี Line Notify แจ้งเตือนผู้ใช้
ว่ายังไม่ได้ทำการส่งและมี ResetDay ResetNight เอาไว้ทำการรีเซ็ตข้อมูลประจำวันและนำไปบันทึกที่ report บน Firestore (ช่วงเวลาสามารถปรับเปลี่ยนได้ตามต้องการ)

ฟังก์ชันสำหรับผู้ใช้งาน(พี่ยามกะกลางคืน)
```
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
```
ฟังก์ชันสำหรับผู้ใช้งาน(พี่ยามกะกลางวัน) และ ทำการบันทึกข้อมูลทั้งหมดลง Firestore และทำการรีเซ็ตข้อมูล
```
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
      await admin.firestore().collection('Status').doc(doc.id).update({
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
```
ฟังก์ชั่นสำหรับการส่ง script ให้ผู้ใช้งาน
```
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
```
ฟังก์ชั่นสำหรับตรวจสอบว่าได้ทำการส่งข้อความแล้วหรือยัง ถ้าไม่ได้ส่งจะทำการแจ้งเตือน
```
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
```
# 7.เชื่อมต่อ Webhook URL เข้ากับ LINE Chatbot
## สร้าง Deploy ฟังก์ชัน
1. เปิด Terminal ขึ้นมาแล้ว shell ไปที่โฟลเดอร์ functions/ จากนั้นพิมพ์คำสั่งด้านล่างนี้
```
firebase deploy --only functions
```
2. หาก deploy สำเร็จ เราจะเห็นฟังก์ชันของเราแสดงอยู่ที่เมนู Functions ใน Firebase console โดยในหน้านี้จะมี Webhook URL และ Cron Job ปรากฎอยู่ที่ column 
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2FUntitled3.jpg?alt=media&token=132c66f0-721d-4246-ad6e-d09b7e33731e)

## เชื่อมต่อ Webhook URL เข้ากับ Messaging API Channel
1. คัดลอก Webhook URL แล้วไปอัพเดทใน Messaging API Channel ที่สร้างไว้ในขั้นตอนที่ 2(สร้าง Provider และ Channel) พร้อมเปิด toggle ที่ชื่อ Use webhook
![This is an image](https://firebasestorage.googleapis.com/v0/b/test-chatbot-2a580.appspot.com/o/photo%2FUntitled4.jpg?alt=media&token=a9133491-a4d6-4aa0-96d0-b972983619bc)



