#import requests
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from message_channel import Channel, Message, channel_list


app = Flask(__name__)
socketio = SocketIO(app)

channels = channel_list()
gen_chn = Channel("general")
channels.add(gen_chn)

@app.route("/")
def index():
    print("rmsg")
    return render_template("index.html")

@app.route("/messages", methods=["GET"])
def messages():
    print("rchn")
    return channels.get_dictionary()

@app.route("/channels", methods=["GET"])
def get_channels():
    return channels.get_channel_names_dict()

#manage sockets
@socketio.on("send_message")
def messaged(data):
    print(str(data))
    new_message = Message(data["sender"],data["content"],data["channel"])
    channels.add_message_to_channel(data["channel"],new_message)
    emit("announce_message", channels.get_dictionary(), broadcast=True)

@socketio.on("new_channel")
def new_channel(data):
    print(str(data))
    #extract
    channel_name = data["channel_name"]
    #check if channel exists
    if channels.get_channel_index_by_name(channel_name) == -1:
        new_chn = Channel(channel_name)
        channels.add(new_chn)
        emit("channel_created", channels.get_channel_names_dict(), broadcast=True)

@socketio.on("new_joined")
def user_joined(data):
    user = data["user"]
    joined_channel = data["channel"]
    announce_str = str(user) + " has joined #" + str(joined_channel)
    print(announce_str)
    new_message = Message(announce_str, ")", joined_channel)
    channels.add_message_to_channel(joined_channel, new_message)
    emit("announce_message", channels.get_dictionary(), broadcast=True)
