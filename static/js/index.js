if(!localStorage.getItem('display_name')){
    //get display name from user
    let display_name = "alex";
    localStorage.setItem('display_name',display_name);
}


document.addEventListener('DOMContentLoaded',() => {

    //connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {

        document.querySelectorAll('button')
    });

});