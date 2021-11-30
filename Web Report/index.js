import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js';
import { getFirestore, getDocs, collection, doc, query, where,  updateDoc} from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js'; 
import { getStorage, ref, deleteObject } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-storage.js';

//สามารถดูได้ใน Project settings ใน General และเลือกเว็บที่เราทำการติดตั้งไว้
const firebaseApp = initializeApp({
    apiKey: "xxxxxxxxxxx",
    authDomain: "xxxxxxxxxxx",
    projectId: "xxxxxxxxxxx",
    storageBucket: "xxxxxxxxxxx",
    messagingSenderId: "xxxxxxxxxxx",
    appId: "xxxxxxxxxxx"
});

const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

const form = document.querySelector('#addForm');

form.addEventListener('submit', async(e)=>{
    e.preventDefault();
    const washingtonRef = doc(db, "Status", form.psw.value);
    await updateDoc(washingtonRef, {
        nameUser: form.uname.value,
        shift: form.shift.value
      });
})


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

const table = document.querySelector('#tbresult');

const table2 = document.querySelector('#tbresult2');

const q = query(collection(db, "Status"), where("shift", "==", 'Day'));
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
        let row = table.insertRow(-1);
        let cell = [];
        for(let i = 0; i <= 7; i++){
            cell[i] = row.insertCell(i); 
        }

        for(let i = 0,  j = 2, k = 5; i < 3 ; i++, j++, k++){
            const milliseconds = doc.data().timestamp[i];
            const dateObject = new Date(milliseconds)
            const humanDateFormat = dateObject.toLocaleString()
            cell[j].innerHTML = humanDateFormat;

            const voiceUrl = doc.data().url[i]; 
            const script = doc.data().script[i];
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
                    onclick(id2, '/voice/th/'+id+'/'+ id3+'.mp3');

                })
            }
        }

        
        cell[0].innerHTML = doc.data().nameUser;
        cell[1].innerHTML = doc.data().userId;
        
});

const q2 = query(collection(db, "Status"), where("shift", "==", 'Night'));
const querySnapshot2 = await getDocs(q2);
querySnapshot2.forEach((doc) => {
    let row = table2.insertRow(-1);
    let cell = [];
    for(let i = 0; i <= 7; i++){
        cell[i] = row.insertCell(i); 
    }

    for(let i = 0,  j = 2; i < 3 ; i++, j++){
        const milliseconds = doc.data().timestamp[i];
        const dateObject = new Date(milliseconds)
        const humanDateFormat = dateObject.toLocaleString()
        cell[j].innerHTML = humanDateFormat;
    }

    for(let i = 0,  j = 5; i < 3 ; i++, j++){ 
        const voiceUrl = doc.data().url[i]; 
        const script = doc.data().script[i];
        if(voiceUrl === undefined){
            let voiceBtn = document.createElement('button-null');
            voiceBtn.textContent = 'X';
            cell[j].appendChild(voiceBtn);
            voiceBtn.addEventListener('click', (e)=>{
                alert('ยังไม่ได้ทำการอัดเสียง');
            })     
        }
        else {
            let voiceBtn = document.createElement('button-voice');
            voiceBtn.textContent = 'ฟังเสียง';
            voiceBtn.setAttribute('voice', voiceUrl);
            voiceBtn.setAttribute('script', script);
            cell[j].appendChild(voiceBtn);   
    
            voiceBtn.addEventListener('click', (e)=>{
                let id = e.target.getAttribute('script');
                let id2 = e.target.getAttribute('voice');
                onclick(id2, '/voice/th/'+id+'/1636344732247'+'.mp3');
            })
        }  
    }
    cell[0].innerHTML = doc.data().nameUser;
    cell[1].innerHTML = doc.data().userId; 
});



