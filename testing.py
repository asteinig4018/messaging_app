import unittest

from message_channel import Message, Channel, channel_list
from datetime import datetime

#from selenium import webdriver
import os
import pathlib

class Tests(unittest.TestCase):

    #Test Message Class

    #test the sender variable is correctly stored
    def test_message_sender(self):
        sender = "test"
        content = "content"
        channel = "channel"
        msg1 = Message(sender,content,channel)
        self.assertEqual(msg1.sender,sender)

    #test the channel variable is correctly stored
    def test_message_channel(self):
        sender = "test"
        content = "content"
        channel = "channel"
        msg1 = Message(sender,content,channel)
        self.assertEqual(msg1.channel,channel)

    #test the dictionary output of message
    #note that the timestamp may fail in the small chance that a minute changes
    def test_message_dict(self):
        sender = "test"
        content = "content"
        channel = "channel"
        timestamp = str(datetime.now().strftime("%b %d %H:%M "))
        expected_dict = {
            "sender": sender,
            "channel": channel,
            "timestamp": timestamp,
            "content": content
        }
        msg1 = Message(sender,content,channel)
        self.assertEqual(msg1.get_dict(), expected_dict)

    #Test Channel Class
    
    #test on initialize
    def test_channel_init(self):
        name = "test"
        chn1 = Channel(name)
        empty_list = list()
        self.assertEqual(chn1.messages,empty_list)

    #test length after adding a message
    def test_channel_msg_len(self):
        name = "test"
        chn1 = Channel(name)
        msg1 = Message("test","test","test")
        chn1.add_message(msg1)
        self.assertEqual(len(chn1.messages),1)

    #test no more than 100 messages
    def test_channel_100_msgs(self):
        name = "test"
        chn1 = Channel(name)
        msg1 = Message("test","test","test")
        for x in range(102):
            chn1.add_message(msg1)
        self.assertEqual(len(chn1.messages),100)

    #Test channel_list

    #test getting channel that does not exist
    def tet_channel_list_dne(self):
        chnlist = channel_list()
        self.assertEqual(chnlist.get_channel_index_by_name("test"),-1)
        


if __name__ == "__main__":
    unittest.main()