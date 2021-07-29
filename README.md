# Voice-dataset-tool
Keeping voice by LINE chatbot
index.js และ package.json เมื่อทำการติดตั้ง firebase CLI ไฟล์จะอยู่ในโฟลเดอร์ที่เราสร้างเพื่อใช้ในการสร้างฟังชั่น

อธิบายขั้นตอนแต่ละวิธี

1. สร้าง Provider และ Channel
  1.1 เข้าไปที่ https://developers.line.biz/console/ แล้วเลือก Log in with LINE account
  1.2 สร้าง Provider สร้าง Channel
  * Channel Access Token คือกุญแจสำคัญในการใช้งาน Messaging API ดังนั้นให้เก็บรักษาไว้ให้ดี

2. สร้างและตั้งค่าโปรเจคใน Firebase
  2.1 สร้างโปรเจคใน Firebase https://console.firebase.google.com/u/0/ ด้วย google account
  2.2 ในหน้า Firebase console ให้คลิก Add project จากนั้นตั้งชื่อโปรเจคตามต้องการ
  2.3 เปลี่ยนแพลนจาก Spark ไปเป็น Blaze (Pay as you go) *เงื่อนไขค่าใช้จ่ายในการใช้ firebase https://firebase.google.com/pricing?authuser=0
  2.4 เปิดใช้งาน Cloud Storage for Firebase สามารถเซ็ตเป็นค่า default 

3. ติดตั้ง Firebase CLI และ Cloud Functions for Firebase
   Firebase CLI เป็นเครื่องมือที่จำเป็นสำหรับการ deploy ตัวฟังก์ชันที่เราพัฒนาขึ้น อีกทั้งยังสามารถจำลองการทำงานฟังก์ชัน(Emulate) ภายในเครื่องที่เราพัฒนาอยู่(Locally) ได้
   * Note: การติดตั้ง Firebase CLI เราจะต้องมี npm ในเครื่องซะก่อน โดยหากคุณยังไม่มี แนะนำให้ติดตั้งผ่าน Node.js  https://nodejs.org/en/
   3.1 เปิด Terminal ขึ้นมาแล้ว run คำสั่ง
      npm install -g firebase-tools
   3.2 ตรวจสอบว่า Firebase CLI ได้ติดตั้งเรียบร้อยแล้วโดย run คำสั่ง (หากสำเร็จจะเห็นเลขเวอร์ชัน)
      firebase --version
   3.3 Initialize โปรเจค
      - รันคำสั่งนี้ จากนั้นตัว browser จะเปิดขึ้นมาให้เราเข้าสู้ระบบด้วย Google account เดียวกันกับที่สร้างโปรดจคใน Firebase
      firebase login
      - สร้างโฟลเดอร์เปล่า(ตัวอย่างโฟลเดอร์ชื่อ bot) แล้วให้ shell เข้าไปในนั้น
      mkdir bot
      cd bot
      - เมื่อเข้ามาในโฟลเดอร์แล้ว ให้ Initial โปรเจคด้วยคำสั่ง
      firebase init functions
      - เลือก Use an existing project จากนั้นจะเห็นเชื่อโปรเจคที่เราสร้างไว้ ก็กด enter ต่อไป
      - ถัดไปจะมีตัวเลือกภาษา 2 ตัวคือ JavaScript และ TypeScript โดยตัวอย่างนี้ให้เลือก JavaScript
      - สุดท้ายมันจะถามว่าจะให้ติดตั้ง dependencies เลยไหมก็ให้ตอบว่า Y ไป
    * Note: เมื่อติดตั้งเสร็จแล้วจะได้โครงสร้าง project อยู่ใน path ที่คุณติตตั้ง
 
 4. สร้างฟังก์ชันสำหรับรับรูปภาพ และตอบกลับผ่าน LINE
    4.1 เพิ่ม Dependencies ที่จำเป็นสำหรับโปรเจคนี้
    - ในโฟลเดอร์ functions ให้เปิดไฟล์ package.json ขี้นมา
    - เพิ่ม axios และ cheerio ลงไปใน dependencies
         "dependencies": {
            "firebase-admin": "^9.7.0",
            "firebase-functions": "^3.13.2",
            "axios": "^0.21.1",
            "uuid-v4": "^0.1.0"
            }
    - ใน Terminal ให้เรา shell เข้าไปในโฟลเดอร์ชื่อ functions จากนั้น install ตัว dependencies ที่เพิ่มเข้ามาใหม่ด้วยคำสั่ง
        npm install
    - เปิดไฟล์ index.js แล้วเริ่มจากการ import ตัว dependencies ต่างๆเข้ามา
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
        
     4.2 สร้างฟังก์ชันสำหรับรับ Webhook Events จาก LINE
     - หลังจากเพิ่ม dependencies ในไฟล์ index.js แล้ว ให้ประกาศตัวแปรที่จำเป็นลงไปดังนี้
        const LINE_MESSAGING_API = "https://api.line.me/v2/bot";
        const LINE_CONTENT_API = "https://api-data.line.me/v2/bot/message";
        const LINE_HEADER = {
        "Content-Type": "application/json",
        Authorization: "Bearer xxxxx"
        };
      
      * ให้เอา Channel Access Token ที่ได้จากขั้นตอนที่ 2(สร้าง Provider และ Channel) ไปแทนที่ xxxxx
      
     - ถัดไปให้สร้างฟังก์ชันชื่อ uploadVoice ในไฟล์ index.js โดยภายในฟังก์ชันให้เขียนเงื่อนไขเพื่อรับ Webhook event จาก LINE ซึ่งเราจะสนใจเฉพาะกรณีที่ผู้ใช้อัพโหลดไฟล์เสียงเข้ามา
        exports.uploadVoice = functions.https.onRequest(async(req, res) => {
        const event = req.body.events[0];
        if (event.type === 'message' && event.message.type === 'image') {
        // เรียกฟังก์ชัน upload เมื่อเข้าเงื่อนไข
        const urls = await upload(event);
    
        // reply ตัว URL ที่ได้กลับไปยังห้องแชท
        await reply(event.replyToken, { type: "text", text: urls });
        }
        return res.end();
        });
      - ที่บรรทัดสุดท้ายของไฟล์ index.js ให้เพิ่มฟังก์ชัน reply() เพื่อส่ง URL ที่ได้จากการอัพโหลดกลับไปยังห้องแชท
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
        
5.การอัพโหลดไฟล์เสียงขึ้นไปเก็บบน Cloud Storage for Firebase
  - ให้เพิ่มฟังก์ชัน upload() ที่บรรทัดล่างสุดของไฟล์ index.js
    const upload = async(event) => {
    };
  - ภายในฟังก์ชัน upload() ให้เพิ่มโค้ดสำหรับการดาวน์โหลด binary ของไฟล์ที่ผู้ใช้ส่งผ่าน LINE เข้ามา
    const url = `${LINE_CONTENT_API}/${event.message.id}/content`;
    const buffer = await axios({
      method: "get",
      headers: LINE_HEADER,
      url: url,
      responseType: "arraybuffer"
      });
  - ถัดจากโค้ดการดาวน์โหลด binary ให้เพิ่มโค้ดสำหรับสร้างไฟล์ temp ใน local โดยใช้ timestamp ที่ได้จาก Webhook event เป็นชื่อไฟล์
  - const filename = `${event.timestamp}.mp3`; 
    * สามารถกำหนดประเภทไฟล์เองได้ 
    const tempLocalFile = path.join(os.tmpdir(), filename);
    await fs.writeFileSync(tempLocalFile, buffer.data);
  - ต่อจากโค้ดด้านบนให้เเพิ่มโค้ดเพื่อ generate ค่า UUID มาเก็บไว้
    const uuid = UUID()
  - ต่อจากโค้ดด้านบน ให้เพิ่มโค้ดเพื่ออัพโหลดไฟล์ขึ้น Cloud Storage for Firebase
    const bucket = admin.storage().bucket()
    const file = await bucket.upload(tempLocalFile, {
    // กำหนด path ในการเก็บไฟล์แยกเป็นแต่ละ userId
    destination: `photos/${event.source.userId}/${filename}`,
    metadata: {
      cacheControl: 'no-cache',
      metadata: {
        firebaseStorageDownloadTokens: uuid
    }
  }
})
  - ต่อจากโค้ดด้านบน ให้เพิ่มคำสั่งลบไฟล์ temp เมื่ออัพโหลดเรียบร้อย
    fs.unlinkSync(tempLocalFile)
  - ท้ายสุดในฟังก์ชัน upload() ให้สร้าง download url ขึ้นมา แล้ว return ออกไป
    const prefix = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o`
    const suffix = `alt=media&token=${uuid}`
    return `${prefix}/${encodeURIComponent(file[0].name)}?${suffix}`
* การอัพโหลดไฟล์ขึ้น Cloud Storage for Firebase ด้วย Firebase Admin ไฟล์จะได้สถานะเป็น private ซึ่งการเพิ่ม firebaseStorageDownloadTokens ที่มีค่าเป็น uuid นี้ เป็นเทคนิคในการทำให้เราได้ URL แบบ public ออกมา

6. เชื่อมต่อ Webhook URL เข้ากับ LINE Chatbot
  6.1 สร้าง Deploy ฟังก์ชัน
     - เปิด Terminal ขึ้นมาแล้ว shell ไปที่โฟลเดอร์ functions/ จากนั้นพิมพ์คำสั่งด้านล่างนี้
       firebase deploy --only functions
     - หาก deploy สำเร็จ เราจะเห็นฟังก์ชันของเราแสดงอยู่ที่เมนู Functions ใน Firebase console โดยในหน้านี้จะมี Webhook URL ปรากฎอยู่ที่ column ชื่อ Trigger
  6.2 เชื่อมต่อ Webhook URL เข้ากับ Messaging API Channel
     - คัดลอก Webhook URL แล้วไปอัพเดทใน Messaging API Channel ที่สร้างไว้ในขั้นตอนที่ 2(สร้าง Provider และ Channel) พร้อมเปิด toggle ที่ชื่อ Use webhook
     - ทดสอบส่งรูปผ่าน LINE Chatbot ได้เลยและหากเราไปเปิดเมนูชื่อ Storage ใน Firebase console เราก็จะเจอไฟล์ที่อัพโหลดไป
