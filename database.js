// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-analytics.js";
import * as fbauth from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAmbgIN54nNV1xtaCQMOvqAZtDHuxY5Nn8",
    authDomain: "oauth2-ffebe.firebaseapp.com",
    databaseURL: "https://oauth2-ffebe-default-rtdb.firebaseio.com",
    projectId: "oauth2-ffebe",
    storageBucket: "oauth2-ffebe.appspot.com",
    messagingSenderId: "218768096816",
    appId: "1:218768096816:web:fa86e7137fd217c00337f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
let auth = fbauth.getAuth(app);

let db = rtdb.getDatabase(app);
const titleRef = rtdb.ref(db, "/");
const chatTable = document.querySelector("#chatTable");
let uid;
let email;
let usr;
let chat;

$("#footerTable").hide();
//$("#chat").hide();

let renderUser = function (userObj)
{
    //$("#userDataRow").html(JSON.stringify(userObj));
    $("#userDataRow").append(`<button type="button" id="logoutBtn">Logout</button>`);
    $("#userDataRow").append(`<button type="button" id="changeUsernameBtn">Change Username</button>`);
    $("#userDataRow").append(`<input id="changeUsernameInput" type="text"/>`);
    $("#logoutBtn").on("click", () => {
        fbauth.signOut(auth);
    });
    $("#changeUsernameBtn").on("click", () => {
        usr = $("#changeUsernameInput").val();
        if (usr) {
            let usernameRef = rtdb.ref(db, `/users/${uid}/username`);
            rtdb.set(usernameRef, usr);
        }
    })
    uid = userObj["uid"];
    email = userObj["email"];
    usr = userObj["displayName"] ? userObj["displayName"] : email;
    chat = "main"
}

fbauth.onAuthStateChanged(auth, user =>
{
    if (!!user)
    {
        renderUser(user);
        $(".loginRow").hide();
        $("#chatTable").show();
        $("#footerTable").show();
        $("#welcomeRow").text("Welcome");
        let flagRef = rtdb.ref(db, "/flag");
        console.log("here");
        rtdb.onValue(flagRef, ss =>
        {
            //alert(ss.val());
        })
    } else
    {
        $(".loginRow").show();
        $("#logoutBtn").hide();
        $("#changeUsernameBtn").hide();
        $("#changeUsernameInput").hide();
        $("#footerTable").hide();
        $("#chatTable").html("");
    }
});


let rulesRef = rtdb.ref(db, "/rules");
rtdb.onValue(rulesRef, ss =>
{
    let rules = ss.val();
    if (!!rules)
    {
        $("#rules").html(rules);
    }
})

rtdb.onValue(titleRef, ss =>
{
    //let chatRef = rtdb.ref(db, "/chats/${chat}");
    while (chatTable.firstChild)
    {
        chatTable.removeChild(chatTable.firstChild);
    }

    for (const mesg in ss.val().chats[chat])
    {
        var row = document.createElement("tr");
        let mesgUid = ss.val().chats[chat][mesg]["uid"];
        let inputText = ss.val().chats[chat][mesg]["inputText"];
        let usrData = ss.val().users[mesgUid];
        let name = document.createElement("td");
        name.style.color = uid == mesgUid ? "green" : "blue";
        name.innerHTML = usrData["username"];
        row.appendChild(name);
        let mesgCol = document.createElement("td");
        mesgCol.innerHTML = inputText;
        row.appendChild(mesgCol);
        chatTable.appendChild(row);
    }
});

//Button Logic

$("#sendBtn").on('click', function ()
{
    let chatRef = rtdb.ref(db, `/chats/${chat}`);
    let inputText = document.querySelector('#sendText').value;
    let mesg = { uid, inputText };
    rtdb.push(chatRef, mesg);

    document.querySelector('#sendText').value = "";


});

$("#regBtn").on("click", () =>
{
    let email = $("#regUser").val();
    let p1 = $("#regPass1").val();
    let p2 = $("#regPass2").val();
    if (p1 != p2)
    {
        alert("Passwords don't match");
        return;
    }
    fbauth.createUserWithEmailAndPassword(auth, email, p1).then(somedata =>
    {
        let uid = somedata.user.uid;
        let userRoleRef = rtdb.ref(db, `/users/${uid}/roles/user`);
        rtdb.set(userRoleRef, true);
        let usernameRef = rtdb.ref(db, `/users/${uid}/username`);
        rtdb.set(usernameRef, email);
    }).catch(function (error)
    {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
    });
});

$("#loginBtn").on("click", () =>
{
    let email = $("#loginUser").val();
    let pwd = $("#loginPass").val();
    fbauth.signInWithEmailAndPassword(auth, email, pwd).then(
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