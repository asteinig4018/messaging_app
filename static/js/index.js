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
            document.getElementById('message_text').value = '';
            socket.emit('send_message',{
                'sender': localStorage.getItem('display_name'), 
                'content': message_text, 
                'channel': document.getElementById('channel_name').innerText });
        };

        document.getElementById('new_channel').onclick = () =>{
            new_channel_name = prompt("Enter new channel name: ");
            socket.emit('new_channel', {
                'channel_name': new_channel_name
            });
        };
    });

    socket.on('announce_message', data => {
        let msg_area = document.createElement('div');
        let current_channel = document.getElementById('channel_name').innerText;
        //clear messages
        document.getElementById('messages').innerHTML= "";
        for(var i = 0; i < data.num_channels; i++){
            var item;
            //if index corresonds to current channel
            if(data.names[i] == current_channel){
                for (item of data.messages[0]){
                    let msg_text = document.createElement('p');
                    //this bold tag only works in firefox
                    msg_text.innerHTML = "<b>" + item.sender +"</b>"+ " - " + item.timestamp + " : " + item.content;
                    msg_area.appendChild(msg_text);
                }
            }
        }
        document.getElementById('messages').appendChild(msg_area);
    });

    socket.on('channel_created', data => {
        let chn_list = document.getElementById('channel_list');
        //clear list
        document.getElementById('channel_list').innerHTML="";
        for(var i = 0; i < data.num_channels; i++){
            let chn_name = document.createElement('a');
            chn_name.innerHTML = "#"+data.names[i];
            chn_name.href = "#";
            chn_name.setAttribute("style","display:block;")
            chn_list.appendChild(chn_name);
        }
    });

});