alert("works here");
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import * as rtdb from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCnGsXBz1XGBWEe-nBRlsav3RB3zFu4BqQ",
    authDomain: "fartfart-1a914.firebaseapp.com",
    databaseURL: "https://fartfart-1a914.firebaseio.com",
    projectId: "fartfart-1a914",
    storageBucket: "fartfart-1a914.appspot.com",
    messagingSenderId: "565526980617",
    appId: "1:565526980617:web:e62d13e9bdca2d8d2db0d8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const btn = document.querySelector('.btn');
var chat = document.querySelector('#chat');

btn.addEventListener('click', function() {
    
    let inputText = document.querySelector('#userchat').value;
    
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(inputText));
    chat.appendChild(li);
 


    //alert(`you changed the theme to ${className}`);

});