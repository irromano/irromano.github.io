

const btn = document.querySelector('.btn');
var chat = document.querySelector('#chat');

btn.addEventListener('click', function() {
    
    let inputText = document.querySelector('#userchat').value;
    
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(inputText));
    chat.appendChild(li);
 


    //alert(`you changed the theme to ${className}`);

});