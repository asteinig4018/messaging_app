if(!localStorage.getItem('display_name')){
    //get display name from user
    let display_name = "";
    while(display_name == ""){
        display_name = prompt("Enter a display name: ");
    }

    localStorage.setItem('display_name',display_name);
}


document.addEventListener('DOMContentLoaded',() => {

    document.querySelector('#display_name').innerHTML = localStorage.getItem('display_name');

    //connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {

        document.getElementById('send_btn').onclick = () => {
            const message_text = document.getElementById('message_text').value
            socket.emit('send_message',{
                'sender': localStorage.getItem('display_name'), 
                'content': message_text, 
                'channel': document.getElementById('channel_name').value });
        };
    });

});