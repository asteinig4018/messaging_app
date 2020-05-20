from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from datetime import datetime

app = Flask(__name__)
socketio = SocketIO(app)

channels = list()


@app.route("/")
def index():
    return render_template("index.html")



class Message:

    def __init__(self,sender,content,channel):
        self.sender = sender
        self.content = content
        self.channel = channel
        self.timestamp = datetime.now()
        self.time_print = str(self.timestamp.strftime("%b %d %H:%M:%S"))

    


class Channel:

    def __init__(self,name):
        self.name = name
        self.messages = list()

    def add_message(self,message):
        self.messages.append(message)
        #delete oldest message if more than 100 messages
        if(len(self.messages) > 100):
            self.messages.pop(0)
