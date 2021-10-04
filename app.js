// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBMu1ndG9TJLrusPwKclacSOb5gN0D3nWE",
    authDomain: "websecromano.firebaseapp.com",
    databaseURL: "https://websecromano-default-rtdb.firebaseio.com",
    projectId: "websecromano",
    storageBucket: "websecromano.appspot.com",
    messagingSenderId: "860340447391",
    appId: "1:860340447391:web:769579800efe33d2c51aaa",
    measurementId: "G-XBXGW7V8QK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

let db = rtdb.getDatabase(app);
const titleRef = rtdb.ref(db, "/");
const mesgRef = rtdb.ref(db, "/chats");

const chat = document.querySelector('#chat');

rtdb.onValue(titleRef, ss =>
{
    while (chat.firstChild)
    {
        chat.removeChild(chat.firstChild);
    }

    for (const mesg in ss.val().chats)
    {
        var li = document.createElement("li");
        li.appendChild(document.createTextNode(ss.val().chats[mesg]));
        chat.appendChild(li);
    }
});

//Button Logic
const btn = document.querySelector('#send');

btn.addEventListener('click', function ()
{

    let inputText = document.querySelector('#userchat').value;
    rtdb.push(mesgRef, inputText);

    //var li = document.createElement("li");
    //li.appendChild(document.createTextNode(inputText));
    //chat.appendChild(li);

    document.querySelector('#userchat').value = "";

    //alert(`you changed the theme to ${className}`);

});

signInBtn.addEventListener('click', function ()
{

    let inputText = usernameTxt.value;
    usernameLabel.innerHTML = inputText;
    signInBtn.style.visibility = 'hidden';
    usernameTxt.style.visibility = 'hidden';


    //alert(`you changed the theme to ${className}`);fewaf

});