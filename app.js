/*// Import the functions you need from the SDKs you need
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
let titleRef = rtdb.ref(db, "/");
rtdb.onValue(titleRef, ss =>
{
    alert(JSON.stringify(ss.val()));
});
*/

let database = new testDataBase;
alert(JSON.stringify(database.getAll()));
database.pushMessage("New Message");
alert(JSON.stringify(database.getMessages()));

//Button Logic
let sendBtn = document.querySelector('#send');
let signInBtn = document.querySelector('#signIn');
let chat = document.querySelector('#chat');
let usernameTxt = document.querySelector('#signInText');
let usernameLabel = document.querySelector('#username');

signInBtn.addEventListener('click', function ()
{

    let inputText = usernameTxt.value;
    usernameLabel.innerHTML = inputText;
    signInBtn.style.visibility = 'hidden';
    usernameTxt.style.visibility = 'hidden';


    //alert(`you changed the theme to ${className}`);fewaf

});

sendBtn.addEventListener('click', function ()
{

    let inputText = document.querySelector('#userchat').value;


    let li = document.createElement("li");
    li.appendChild(document.createTextNode(inputText));
    chat.appendChild(li);



    //alert(`you changed the theme to ${className}`);

});