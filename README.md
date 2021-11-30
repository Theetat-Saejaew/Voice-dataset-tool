# ขั้นตอน
# 1. สร้าง Provider และ Channel
## สมัครเป็น LINE Developer
###### จุดเริ่มขบวนสำหรับการพัฒนาแอปพลิเคชันต่างๆบนแพลตฟอร์มของ LINE คือคุณจะต้องสมัครเป็น LINE Developer ก่อน
1.เข้าไปที่ https://developers.line.biz/console/ แล้วเลือก Log in with LINE account(สีเขียว) เพื่อเข้าสู่ระบบ
> รูปภาพ

2.เข้าสู่ระบบด้วยบัญชี LINE ของคุณให้เรียบร้อย
> รูปภาพ

3.กรอกชื่อและอีเมล พร้อมกดยอมรับ Agreement จากนั้นกดปุ่ม Create my account เป็นอันเสร็จสิ้นขั้นตอนการสมัครเป็น LINE Developer
> รูปภาพ

## สร้าง Provider
Provider คือชื่อผู้ให้บริการ ซึ่งจะไปแสดงตามหน้า consent ต่างๆ หรือเรียกได้ว่าเป็น superset ของแอปทั้งหลายที่เราจะพัฒนาขึ้นรวมถึง LIFF app ด้วย โดยการสร้างเพียงให้ระบุชื่อของ Provider ลงไป ซึ่งอาจจะตั้งเป็นชื่อตัวเอง, ชื่อบริษัท, ชื่อทีม หรือชื่อกลุ่มก็ได้
> รูปภาพ-----
> Remember: 1 Account สามารถมี Provider สูงสุดได้ 10 Providers และไม่สามารถมีคำว่า LINE ในชื่อ Provider ได้

## สร้าง Channel
Channel เปรียบเสมือนแอป หรือเรียกได้ว่าเป็น subset ของ Provider โดยมีอยู่ 3 รูปแบบ คือ LINE Login, Messaging API และ Clova Skill
1. สำหรับการพัฒนา Chatbot เราจะต้องเลือก Create a Messaging API channel
> รูปภาพ-----

2.เมื่อกดเลือก Messaging API channel จะเข้าสู่หน้าที่ให้ระบุรายละเอียดต่างๆลงไป แล้วกดสร้าง
> รูปภาพ----- Note: ส่วนของ Privacy Policy และ Terms of Use สามารถระบุภายหลังได้

## เพิ่ม Chatbot เป็นเพื่อนและตั้งค่า Channel
1.หลังจากกดสร้าง Channel แล้ว ให้ไปที่ Tab ชื่อ Messaging API และทำการแสกน QR code ด้วยแอป LINE เพื่อเพิ่ม Chatbot เป็นเพื่อน
> รูปภาพ-----

2.ให้ปิด Auto-reply messages เนื่องจากฟีเจอร์นี้จะเป็น default การตอบกลับของ Chatbot ซึ่งไม่จำเป็นต้องใช้ฟีเจอร์นี้
> รูปภาพ-----

3.กลับมาที่ Channel ที่เราสร้างใน Tab ชื่อ Messaging API ตรงส่วนของ Channel access token ให้กดปุ่ม Issue
> รูปภาพ ----- Important: ตัว Channel Access Token คือกุญแจสำคัญในการใช้งาน Messaging API ดังนั้นให้เก็บรักษาไว้ให้ดี

# 2.สร้างและตั้งค่าโปรเจคใน Firebase
เบื้องหลังของ Chatbot ตัวนี้ เราจะใช้บริการใน Firebase อย่าง Cloud Functions for Firebase, Cloud Storage for Firebase และ Firebase Extensions ดังนั้นขั้นตอนนี้เราจะมาสร้างโปรเจค Firebase เพื่อใช้งานกัน
## สร้างโปรเจคใน Firebase
1. ให้ Sign in ใน Firebase console ด้วย Google account
2. ในหน้า Firebase console ให้คลิก Add project จากนั้นตั้งชื่อโปรเจคตามต้องการ
> รูปภาพ
3. เมื่อกด Continue แล้วให้ข้ามการตั้งค่า Google Analytics ไป เพราะคุณจะไม่ได้ใช้มันในโปรเจคนี้ 
## เปลี่ยนแพลนจาก Spark ไปเป็น Blaze (Pay as you go)
เนื่องจาก Cloud Functions for Firebase มีเงื่อนไขว่า หากต้องการไป request ตัว APIs ที่อยู่ภายนอก Google คุณจำเป็นจะต้องใช้ Blaze plan(เราจะต้องไปเรียก Messaging API ของ LINE)
> รูปภาพ -Note: เมื่อคุณเปลี่ยนมาใช้ Blaze plan นอกจากที่คุณจะสามารถ request ตัว APIs ที่อยู่ภายนอก Google ได้แล้ว คุณยังจะได้โค้วต้าในการเรียกใช้งานฟังก์ชันฟรี 2,000,000 ครั้ง/เดือน

## เปิดใช้งาน Cloud Storage for Firebase
1. ในหน้าโปรเจคที่เราสร้างจะเลือกเมนูชื่อ Storage ที่อยู่ทางซ้ายมือ
2. ในหน้า Cloud Storage for Firebase ให้คลิก Get started
> รูปภาพ

3. Popup ของ Default ของ Security Rules จะแสดงขึ้นมา แล้วก็ให้เรากด Next ไป 
> รูปภาพ
4. เลือก Location ของ Cloud Storage ที่ต้องการ แล้วกด Done
> รูปภาพ ---Remember: Location ที่คุณเลือกในขั้นตอนนี้ จะไม่สามารถเปลี่ยนแปลงได้ในภายหลัง

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
> รูปภาพ

5. ถัดไปจะมีตัวเลือกภาษา 2 ตัวคือ JavaScript และ TypeScript โดยตัวอย่างนี้ให้เลือก JavaScript
6. จากนั้นมันจะถามว่าจะให้ติดตั้ง ESLint ไหม ตรงนี้แนะนำให้ตอบ N ไปก่อน(สำหรับมือใหม่)
7. สุดท้ายมันจะถามว่าจะให้ติดตั้ง dependencies เลยไหมก็ให้ตอบว่า Y ไป
> รูปภาพ

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

2. ถัดไปให้สร้างฟังก์ชันชื่อ uploadPhoto ในไฟล์ index.js โดยภายในฟังก์ชันให้เขียนเงื่อนไขเพื่อรับ Webhook event จาก LINE ซึ่งเราจะสนใจเฉพาะกรณีที่ผู้ใช้อัพโหลดรูปเข้ามา
```
exports.uploadPhoto = functions.https.onRequest(async(req, res) => {
  const event = req.body.events[0];
  if (event.type === 'message' && event.message.type === 'image') {
    // เรียกฟังก์ชัน upload เมื่อเข้าเงื่อนไข
    const urls = await upload(event);
    
    // reply ตัว URL ที่ได้กลับไปยังห้องแชท
    await reply(event.replyToken, { type: "text", text: urls });
  }
  return res.end();
});
```
3. ที่บรรทัดสุดท้ายของไฟล์ index.js ให้เพิ่มฟังก์ชัน reply() เพื่อส่ง URL ที่ได้จากการอัพโหลดกลับไปยังห้องแชท
```
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
```
# 5.การอัพโหลดรูปขึ้นไปเก็บบน Cloud Storage for Firebase
1. ให้เพิ่มฟังก์ชัน upload() ที่บรรทัดล่างสุดของไฟล์ index.js
```
const upload = async(event) => {
};
```
2. ภายในฟังก์ชัน upload() ให้เพิ่มโค้ดสำหรับการดาวน์โหลด binary ของไฟล์ที่ผู้ใช้ส่งผ่าน LINE เข้ามา
```
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
const filename = `${event.timestamp}.jpg`;
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
  destination: `photos/${event.source.userId}/${filename}`,
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
# 6.เชื่อมต่อ Webhook URL เข้ากับ LINE Chatbot
## สร้าง Deploy ฟังก์ชัน
1. เปิด Terminal ขึ้นมาแล้ว shell ไปที่โฟลเดอร์ functions/ จากนั้นพิมพ์คำสั่งด้านล่างนี้
```
firebase deploy --only functions
```
2. หาก deploy สำเร็จ เราจะเห็นฟังก์ชันของเราแสดงอยู่ที่เมนู Functions ใน Firebase console โดยในหน้านี้จะมี Webhook URL ปรากฎอยู่ที่ column ชื่อ Trigger
> รูปภาพ

## เชื่อมต่อ Webhook URL เข้ากับ Messaging API Channel
1. คัดลอก Webhook URL แล้วไปอัพเดทใน Messaging API Channel ที่สร้างไว้ในขั้นตอนที่ 2(สร้าง Provider และ Channel) พร้อมเปิด toggle ที่ชื่อ Use webhook
> รูปภาพ

2. ทดสอบส่งรูปผ่าน LINE Chatbot ได้เลย โดยผลลัพธ์ที่ได้ก็จะมีหน้าตาประมาณนี้
> รูปภาพ

และหากเราไปเปิดเมนูชื่อ Storage ใน Firebase console เราก็จะเจอไฟล์ที่อัพโหลดไป
> รูปภาพ










