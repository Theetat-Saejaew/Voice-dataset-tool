import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js';
import { getFirestore, getDocs, collection } from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js'; 
import {getAuth, onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js"

const firebaseApp = initializeApp({
    apiKey: "AIzaSyDM91iP00KDFODqLQSvcabYNuuXDCfs5VY",
    authDomain: "test-chatbot-2a580.firebaseapp.com",
    projectId: "test-chatbot-2a580",
    storageBucket: "test-chatbot-2a580.appspot.com",
    messagingSenderId: "202486488731",
    appId: "1:202486488731:web:e6337b5f7171d14375303e"
});

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const table = document.querySelector('#tbresult');

const querySnapshot = await getDocs(collection(db, 'status'));
querySnapshot.forEach((doc) => {
    showData(doc);
});

function showData(doc) {
    let row = table.insertRow(-1);
    let cell0 = row.insertCell(0);
    let cell1 = row.insertCell(1);
    let cell2 = row.insertCell(2);
    let cell3 = row.insertCell(3);

    cell0.innerHTML = doc.data().userId;
    cell1.innerHTML = doc.data().check_in;
    cell2.innerHTML = doc.data().Status;
};

