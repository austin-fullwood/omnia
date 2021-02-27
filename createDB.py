import pymongo
from pymongo import MongoClient
import requests 
import pdb
import json
import pprint
import urllib
client = MongoClient()


client = MongoClient('localhost', 27017)
realClient = MongoClient(host="mongodb+srv://sharonj7%40vt.edu:SystemsCapstone21@cluster0.g1kbr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority") #connect to db
db = realClient.database

posts = db.posts



object = requests.get("https://api.propublica.org/congress/v1/117/senate/bills/introduced.json", headers={"X-API-Key":"ymtdPihZGypjDViP7RX0kUgw1aUtO6ceWee8CQcu"})

theDict = json.loads(object.content.decode('utf-8')) 


for i in range(20):
    bill =  theDict['results'][0]['bills'][i]
    id = bill['bill_id']
    title = bill['title']
    url = bill['congressdotgov_url']
    intro_date = bill['introduced_date']
    post = {
        'bill_id': id,
        'title': title,
        'url': url,
        'overview': '',
        'introducedDate': intro_date,
        'pros': [],
        'cons': []
    }
    posts.insert_one(post)

    

