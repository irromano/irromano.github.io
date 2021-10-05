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
const chat = document.querySelector("#chat");
const app = document.querySelector("#app");


let renderUser = function (userObj)
{
    let logout = document.querySelector("#logout");
    app.html(JSON.stringify(userObj));
    app.append(`<button type="button" id="logout">Logout</button>`);
    logout.on("click", () =>
    {
        fbauth.signOut(auth);
    })
}

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
const sendBtn = document.querySelector('#send');

sendBtn.addEventListener('click', function ()
{

    let inputText = document.querySelector('#userchat').value;
    rtdb.push(mesgRef, inputText);

    //var li = document.createElement("li");
    //li.appendChild(document.createTextNode(inputText));
    //chat.appendChild(li);

    document.querySelector('#userchat').value = "";

    //alert(`you changed the theme to ${className}`);

});

const resgisterBtn = document.querySelector("#register");

resgisterBtn.addEventListener("click", function ()
{
    let username = document.querySelector("#regemail").val();
    let pwd1 = document.querySelector("#regpass1").val();
    let pwd2 = document.querySelector("#regpass2").val();
    if (pwd1 != pwd2)
    {
        alert("Passwords don't match");
        return;
    }
    fbauth.createUserWithEmailAndPassword(auth, username, pwd1).then(somedata =>
    {
        let uid = somedata.user.uid;
        let userRoleRef = rtdb.ref(db, `/users/${uid}/roles/user`);
        rtdb.set(userRoleRef, true);
    }).catch(function (error)
    {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
    });
});

const signInBtn = document.querySelector("#signIn");

signInBtn.addEventListener("click", function ()
{

    let username = document.querySelector("#signInUsername").val();
    let pwd = document.querySelector("#signInPassword");
    fbauth.signInWithEmailAndPassword(auth, username, pwd).then(
        somedata =>
        {
            console.log(somedata);
        }).catch(function (error)
        {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        });
});