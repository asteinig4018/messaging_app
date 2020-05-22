#import requests
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from message_channel import Channel, Message, channel_list


app = Flask(__name__)
socketio = SocketIO(app)

channels = channel_list()
gen_chn = Channel("general")
channels.append(gen_chn)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/send", methods=["POST"])
def send():
    pass

@socketio.on("send_message")
def messaged(data):
    new_message = Message(data["sender"],data["content"],data["channel"])

    emit("announce_message", {}, broadcast=True)
