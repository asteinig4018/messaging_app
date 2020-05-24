//global variable socket
var socket;


document.addEventListener('DOMContentLoaded',() => {
    //on load:

    //1. connect to websocket
    socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {

        //2. new user setup

        if(!localStorage.getItem('display_name')){
            //get display name from user
            let display_name = "";
            while(display_name == ""){
                display_name = prompt("Enter a display name: ");
            }
    
            localStorage.setItem('display_name',display_name);
    
            let in_channels = ["general"];
            localStorage.setItem('in_channels', JSON.stringify(in_channels));
    
            //announce
            socket.emit('new_joined', {
                'user' : localStorage.getItem('display_name'),
                'channel' : "general"
            });
        }

        //3. show display name
        document.querySelector('#display_name').innerHTML = localStorage.getItem('display_name');
        

        // 4. Listen for buttons

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


    

    //5. show messages
    fetch(location.protocol + "//" + document.domain + ":" + location.port + "/messages")
        .then(response => response.json())
        .then(data => {
            display_messages(data, false);
        });

    //6. show channels
    fetch(location.protocol + "//" + document.domain + ":" + location.port + "/channels")
        .then(response => response.json())
        .then(data => {
            //console.log("requested channels");
            display_channels(data);
            //console.log(data);
        });

    //receive emits

    socket.on('announce_message', data => {
        display_messages(data, false);
    });

    socket.on('channel_created', data => {
        display_channels(data);
    });

});

    //channel change
function change_channel(name){

    let cur_channel = document.getElementById('channel_name').innerText;

    document.getElementById('channel_name').innerText = name;

    //check if visited
    let visited = JSON.parse(localStorage.getItem('in_channels'));

    if(!visited.includes(name)){
        //announce
        socket.emit('new_joined', {
            'user' : localStorage.getItem('display_name'),
            'channel' : name
        });
        //add to list
        
        visited.push(name);
        localStorage.setItem('in_channels', JSON.stringify(visited));
    }

    //request channel messages
    fetch(location.protocol + "//" + document.domain + ":" + location.port + "/messages")
        .then(response => response.json())
        .then(data => {
            display_messages(data, true);
    });

    //unbold channel switched to
    const el1 = document.querySelector("#channel-"+name);
    el1.setAttribute("style","display:block; font-weight:normal;");

    return false;
}

function display_messages(data, chn_switch){
    let msg_area = document.createElement('div');
    let current_channel = document.getElementById('channel_name').innerText;
    //clear messages
    document.getElementById('messages').innerHTML= "";
    for(var i = 0; i < data.num_channels; i++){
        var item;
        //if index corresonds to current channel
        if(data.names[i] == current_channel){


            //console.log(current_channel);
            for (item of data.messages[i]){
                let msg_text = document.createElement('p');
                //this bold tag only works in firefox
                msg_text.innerHTML = "<b>" + item.sender +"</b>"+ " - " + item.timestamp + " : " + item.content;
                msg_area.appendChild(msg_text);
            }
        }
        else if (data.names[i] == data.most_recent_channel && !chn_switch){
            //if channel is not selected, bold name to indicate new message
            const element = document.querySelector("#channel-"+data.names[i]);
            console.log(element.innerText);
            element.setAttribute("style","display:block; font-weight:bold;");
        }
    }
    document.getElementById('messages').appendChild(msg_area);
}

function display_channels(data){
    let chn_list = document.getElementById('channel_list');
        //clear list
        document.getElementById('channel_list').innerHTML="";
        for(var i = 0; i < data.num_channels; i++){
            let chn_name = document.createElement('a');
            chn_name.innerHTML = "#"+data.names[i];
            chn_name.href = "#";
            chn_name.setAttribute("style","display:block;");
            chn_name.setAttribute("id","channel-"+data.names[i]);
            chn_name.setAttribute("onclick", "change_channel('"+data.names[i]+"'); return false;");
            chn_list.appendChild(chn_name);
        }
}