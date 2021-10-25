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
const boardTable = document.querySelector("#boardTable");
let uid;
let email;
let usr;
let admin;
const defaultChat = "main";
let chat = defaultChat;

// List of editable messages
let mesgSet = {};

$("#footerTable").hide();
$("#chatTable").hide();
$("#boardTable").hide();

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
    let roleRef = rtdb.ref(db, `/users/${uid}/roles/admin`);
    
}

fbauth.onAuthStateChanged(auth, user =>
{
    if (!!user)
    {
        renderUser(user);
        $(".loginRow").hide();
        $("#chatTable").show();
        $("#footerTable").show();
        $("#boardTable").show();
        $("#welcomeRow").text("Welcome to HabibiChat");
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
        $("#boardTable").hide();
        $("#chatTable").hide();
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
    refreshChatMessages(ss);

    while (boardTable.firstChild) {
        boardTable.removeChild(boardTable.firstChild);
    }

    /* for every chat in the app */
    for (const chatBoard in ss.val().chats) {
        let row = document.createElement("tr");
        let col = document.createElement("td");
        let button = document.createElement("button");
        let chatName = chatBoard;
        button.classList.add('chatBtn');
        button.textContent = chatName;
        button.id = chatName;
        col.appendChild(button);
        row.appendChild(col);
        $("#boardTable").append(row);
    }
    let row = document.createElement("tr");
    let col = document.createElement("td");
    let button = document.createElement("button");
    let chatName = "+";
    button.classList.add('chatBtn');
    button.textContent = chatName;
    button.id = "newChatBtn";
    col.appendChild(button);
    row.appendChild(col);
    $("#boardTable").append(row);
    let newChatInput = document.createElement("input");
    $("#boardTable").append(newChatInput);

    $(`#${button.id}`).on("click", () => {
        if (newChatInput.value) {
            let chatRef = rtdb.ref(db, `/chats/${newChatInput.value}`);
            let inputText = newChatInput.value;
            let mesg = { uid, inputText }
            newChatInput.value = "";
            chat = inputText;
            rtdb.set(chatRef, "");//{inputText : mesg});
        }
    })

    // Get the element, add a click listener...
    boardTable.addEventListener("click", function (e) {
        // e.target is the clicked element!
        // If it was a list item
        //console.log(`Node type clicked is ${e.target.nodeName}`);
        if (e.target && e.target.nodeName == "BUTTON") {
            chat = e.target.id;
            refreshChatMessages(ss);
            // List item found!  Output the ID!
            //console.log("List item ", e.target.id.replace("post-", ""), " was clicked!");
        }
    });

});

/*
 * Helper function which refreshes the messages on the current chat.
 */
function refreshChatMessages(data)
{
    let editMesgCnt = 0;
    //let chatRef = rtdb.ref(db, "/chats/${chat}");
    while (chatTable.firstChild) {
        chatTable.removeChild(chatTable.firstChild);
    }

    /* for every message in the current chat */
    for (const mesg in data.val().chats[chat]) {
        var row = document.createElement("tr");
        let mesgUid = data.val().chats[chat][mesg]["uid"];
        let ownMesg = uid == mesgUid;
        let inputText = data.val().chats[chat][mesg]["inputText"];
        let usrData = data.val().users[mesgUid];
        let name = document.createElement("td");
        name.style.color = ownMesg ? "green" : "blue";
        name.innerHTML = usrData["username"];
        row.appendChild(name);
        let mesgCol = document.createElement("td");
        mesgCol.innerHTML = inputText;
        row.appendChild(mesgCol);
        if (ownMesg || admin) {

            let editBtn = document.createElement("button");
            editBtn.id = mesg;
            editBtn.textContent = "edit";

            let editCol = document.createElement("td");
            let editText = document.createElement("input");
            editText.id = "editText" + editMesgCnt.toString();
            editText.hidden = true;

            editMesgCnt++;

            mesgSet[editMesgCnt] = editBtn.id;
            editCol.appendChild(editBtn);
            editCol.appendChild(editText);
            row.appendChild(editCol);
        }
        chatTable.appendChild(row);
    }
    
    chatTable.addEventListener("click", function (e) {

        if (e.target && e.target.nodeName == "BUTTON") {
            let textField = e.target.nextSibling;
            let tempText = textField.value;
            if (!textField.hidden && tempText) {
                let chatRef = rtdb.ref(db, `/chats/${chat}/${e.target.id}/inputText/`);
                rtdb.set(chatRef, tempText);
            }
            else if (textField.hidden) {
                textField.hidden = false;
            }
        }
    });
}

//Button Logic

$("#sendBtn").on('click', function ()
{
    let mesgText = document.querySelector('#sendText').value
    if (mesgText) {
        let chatRef = rtdb.ref(db, `/chats/${chat}`);
        let inputText = mesgText;
        let mesg = { uid, inputText };
        rtdb.push(chatRef, mesg);

        document.querySelector('#sendText').value = "";
    }
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
        let adminRoleRef = rtdb.ref(db, `/users/${uid}/roles/admin`);
        rtdb.set(userRoleRef, false);
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