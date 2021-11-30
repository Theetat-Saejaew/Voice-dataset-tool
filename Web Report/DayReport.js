import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js';
import { getFirestore, doc,  getDoc } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js'; 
import { getStorage, ref,  deleteObject } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-storage.js';

//สามารถดูได้ใน Project settings ใน General และเลือกเว็บที่เราทำการติดตั้งไว้

const firebaseApp = initializeApp({
    apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    projectId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    storageBucket: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    messagingSenderId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    appId: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
});

// const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const table = document.querySelector('#tbresult');

const form = document.querySelector('#addDay');
form.addEventListener('submit', async(e)=>{
    e.preventDefault();
    function onclick(url, path){
        var a = new Audio(url);
        a.play().then(() => {
            var r = confirm("ตรวจสอบว่าได้ยินเสียงหรือไม่!");
                if (r == true) {
                    alert('ตรวจสอบเสร็จเรียบร้อย')
                } else {
                var v = confirm("คุณมั่นใจว่าไม่ได้ยินเสียงของไฟล์");    
                if (v == true) {
                    const storageRef = ref(storage, path);
                    deleteObject(storageRef).then(() => {
                        alert('ตรวจสอบเสร็จเรียบร้อย')
                        })
                    }
                }
          })
    }
    
    const day = form.text.value;
    console.log(day)
    const docRef = doc(db, "Week", day);
    const docSnap = await getDoc(docRef);
    
    const index = Object.values(docSnap.data());
    index.forEach((docs)=>{
        let row = table.insertRow(-1);
        let cell = [];
    
        for(let i = 0; i <= 6; i++){
            cell[i] = row.insertCell(i); 
        }
    
            for(let i = 0,  j = 1 , k = 4; i < 3 ; i++, j++, k++){
            const milliseconds = docs.time[i];
            const dateObject = new Date(milliseconds)
            const humanDateFormat = dateObject.toLocaleString()
            cell[j].innerHTML = humanDateFormat;
    
            const voiceUrl = docs.url[i]; 
            const script = docs.script[i];
                if(voiceUrl === undefined){
                    let voiceBtn = document.createElement('button-null');
                    voiceBtn.textContent = 'X';
                    cell[k].appendChild(voiceBtn);   
    
                    voiceBtn.addEventListener('click', (e)=>{
                        alert('ยังไม่ได้ทำการอัดเสียง');
                    })
                }
                else {
                    let voiceBtn = document.createElement('button-voice');
                    voiceBtn.textContent = 'ฟังเสียง';
                    voiceBtn.setAttribute('voice', voiceUrl);
                    voiceBtn.setAttribute('script', script);
                    voiceBtn.setAttribute('file', milliseconds);
                    cell[k].appendChild(voiceBtn);   
            
                    voiceBtn.addEventListener('click', (e)=>{
                        let id = e.target.getAttribute('script');
                        let id2 = e.target.getAttribute('voice');
                        let id3 = e.target.getAttribute('file');
                        onclick(id2, '/voice/th/'+id + '/'+id3+'.mp3');//แก้ชื่อไฟล์ที่จะลบด้วย
    
                    })
                }
    
            }
            cell[0].innerHTML = docs.name;
    
    })
    
})

