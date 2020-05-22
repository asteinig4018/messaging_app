from datetime import datetime

class Message:

    def __init__(self,sender,content,channel):
        self.sender = sender
        self.content = content
        self.channel = channel
        self.timestamp = datetime.now()
        self.time_print = str(self.timestamp.strftime("%b %d %H:%M:%S"))

    def get_dict(self):
        self.var_dictionary = {
            "sender" : self.sender,
            "channel" : self.channel,
            "timestamp" : self.time_print,
            "content" : self.content
        }
        return self.var_dictionary


    
class Channel:

    def __init__(self,name):
        self.name = name
        self.messages = list()

    def add_message(self,message):
        self.messages.append(message)
        #delete oldest message if more than 100 messages
        if(len(self.messages) > 100):
            self.messages.pop(0)

class channel_list:

    def __init__(self):
        self.channel_names = list()
        self.channels = list()

    def add(self, channel):
        self.channel_names.append(channel.name)
        self.channels.append(channel)

    def get_channel_index_by_name(self, name):
        num_index =self.channel_names.index(name)
        return num_index

    def add_message_to_channel(self, chn_name, message):
        self.channels[self.get_channel_index_by_name(chn_name)].add_message(message)

    def get_dictionary(self):
        self.dictionary = {}
        self.dictionary["names"] = self.channel_names
        self.dictionary["num_channels"] = len(self.channel_names)
        json_list = list()
        for channel in self.channels:
            message_json_list = list()
            for message in channel.messages:
                message_json_list.append(message.get_dict())
            json_list.append(message_json_list)

        self.dictionary["messages"] = json_list

        return self.dictionary