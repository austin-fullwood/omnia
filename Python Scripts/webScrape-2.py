import requests
from bs4 import BeautifulSoup
import sys
import re

import pymongo
from pymongo import MongoClient
import json
import urllib

from selenium import webdriver
from selenium.webdriver.common.keys import Keys

options = webdriver.ChromeOptions()
options.add_argument('--ignore-certificate-errors')
options.add_argument('--incognito')
options.add_argument('--headless')
driver = webdriver.Chrome(options=options)

client = pymongo.MongoClient("mongodb+srv://omnia:greencomputing@cluster0.g1kbr.mongodb.net/omnia?retryWrites=true&w=majority")
db = client.omnia
reps = db.representatives
bills = db.bills

ADD_TO_SET = "$addToSet"

URL = "https://omnia.ninja/api/unvotedBills"
r = requests.post(url = URL)
dict = json.loads(r.text)
a = []
for bill in dict:
    a.append(bill['bill_id'])

for bill in a:
    voted = False
    passed = False
    dash = bill.find("-")
    bill_id = bill[:dash]
    url = "https://www.govtrack.us/congress/bills/117/{}".format(bill_id)
    currBill = requests.get(url)
    soup = BeautifulSoup(currBill.content, 'html.parser')
    results = soup.find(id='content')
    properties = results.find('div', class_='property-panel').text
    status_index = properties.find("Status")
    middle = properties[status_index:]
    on_index = middle.find("on ")
    piece = middle[:on_index]
    if "Agreed" in piece or "Enacted" in piece or "Failed" in piece:
        voted = True
        if "Agreed" in piece or "Enacted" in piece:
            passed = True

    if voted:
        print("Must check rep voting and populate DB")
        url = 'https://www.govtrack.us/congress/votes#chamber[]=1&category[]=3'
        driver.get(url)
        results = driver.page_source
        soup = BeautifulSoup(results, 'html.parser')
        links = soup.find_all('div', class_='col-xs-10 col-md-11')
        for link in links:
            name = link.find('div', class_='col-xs-12').text
            number = link.find('div', class_='col-xs-12 col-sm-6 col-md-4').text
            temp = re.findall(r'\d+', bill_id)
            id = list(map(int, temp))
            temp2 = re.findall(r'\d+', name)
            id2 = list(map(int, temp2))
            match = id[0]
            match2 = id2[0]
            if match == match2:
                print("found match")
                pound_index = number.find("#")
                voteNum = number[pound_index:].split(" ")
                vote = voteNum[0][1:-1]
                # navigate to vote roll call page using url + vote
                url = 'https://www.govtrack.us/congress/votes/117-2021/s{}'.format(vote)
                driver.get(url)
                results = driver.page_source
                soup = BeautifulSoup(results, 'html.parser')
                allVotes = soup.find(id="vote-details-all").text
                va = allVotes.find("Virginia")
                wa = allVotes.find("Washington")
                vaReps = allVotes[va:wa]
                vaSplit = vaReps.split()
                votedYes1 = False
                votedYes2 = False
                kaineVote = vaSplit[1]
                if kaineVote == "Yea":
                    votedYes1 = True
                warnerVote = vaSplit[7]
                if warnerVote == "Yea":
                    votedYes2 = True
                # found info, return to db
                filter1 = { 'firstName': 'Timothy'}
                filter2 = {'firstName': 'Mark'}
                billJson1 = {
                    "billId":bill,
                    "votedYes": votedYes1
                }
                billJson2 = {
                    "billId":bill,
                    "votedYes": votedYes2
                }
                newVal1 = {ADD_TO_SET: {'bills': billJson1} }
                newVal2 = {ADD_TO_SET: {'bills': billJson2} }
                reps.update_one(filter1, newVal1)
                reps.update_one(filter2, newVal2)
                # toggle repVoted for bill here
                bills.update_one({'bill_id': bill}, { "$set": { 'repVoted': True } })


        # no match was found, vote was unanimous, return to db
        if passed:
            filter1 = { 'firstName': 'Timothy'}
            filter2 = {'firstName': 'Mark'}
            billJson1 = {
                "billId":bill,
                "votedYes": True
            }
            billJson2 = {
                "billId":bill,
                "votedYes": True
            }
            newVal1 = {ADD_TO_SET: {'bills': billJson1} }
            newVal2 = {ADD_TO_SET: {'bills': billJson2} }
            reps.update_one(filter1, newVal1)
            reps.update_one(filter2, newVal2)
            # toggle repVoted for bill here
            bills.update_one({'bill_id': bill}, { "$set": { 'repVoted': True } })
        else:
            filter1 = { 'firstName': 'Timothy'}
            filter2 = {'firstName': 'Mark'}
            billJson1 = {
                "billId":bill,
                "votedYes": False
            }
            billJson2 = {
                "billId":bill,
                "votedYes": False
            }
            newVal1 = {ADD_TO_SET: {'bills': billJson1} }
            newVal2 = {ADD_TO_SET: {'bills': billJson2} }
            reps.update_one(filter1, newVal1)
            reps.update_one(filter2, newVal2)
            # toggle repVoted for bill here
            bills.update_one({'bill_id': bill}, { "$set": { 'repVoted': True } })

    else:
        print("Continue on to next bill")
        continue
