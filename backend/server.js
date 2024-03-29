//Setup required imports
const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();
var firebase = require("firebase/app");
require("firebase/auth");

/*CORS stands for Cross Origin Resource Sharing and allows modern web browsers to be able to send AJAX requests and receive HTTP responses for resource from other domains other that the domain serving the client side application.*/
const cors = require('cors');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Initialize connection to Mongo database and respective collections
var db = null
var users = null
var bills = null
var representatives = null
MongoClient.connect('mongodb+srv://omnia:greencomputing@cluster0.g1kbr.mongodb.net/omnia?retryWrites=true&w=majority', {
    useUnifiedTopology: true
})
    .then(client => {
        console.log('Connected to Database')
        db = client.db('omnia')
        users = db.collection('users')
        bills = db.collection('bills')
        representatives = db.collection('representatives')
    })
    .catch(error => console.error(error));

//CRUD Handlers

//API to register user
//JSON request needs email, password, firstName, lastName, address, city, state, zip
//Returns token to authenticate user
app.post('/user/register', (req, res) => {
    let json = req.body;
    email = json.email;
    password = json.password;

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            var token = null
            user.getIdToken(true).then(function(idToken){
                //Return token
                res.send({'token':idToken})
                token = idToken
            }).catch(function(error) {
                // Handle error
            });
            delete json['password']
            users.insertOne(json)
        })
        .catch((error) => {
            var errorMessage = error.message;
            res.send(errorMessage)
        });
})

//API to sign in User
//JSON request needs email, password
//Returns token to authenticate user
app.post('/user/signin', (req, res) => {
    let json = req.body
    email = json.email;
    password = json.password;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            user.getIdToken(true).then(function(idToken){
                // Return token
                res.send({'token':idToken})
            }).catch(function(error) {
                // Handle error
            });

        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            res.send(errorMessage)
        });
})

//API to reset user password
//JSON request needs email
app.post('/user/reset', (req, res) => {
    let json = req.body
    email = json.email;
    firebase.auth().sendPasswordResetEmail(email)
        .then(function(){
            res.sendStatus(200);
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            res.send(errorMessage)
        });
})

//API to retrieve user data
//JSON request needs email, token
//Returns user email, firstName, lastName, address, city, state, zip
app.post('/user/data', (req, res) => {
    let json = req.body
    token = json.token
    users.findOne({"email":email}, function(err, result) {
        if (err) throw err;
        res.send(result)
    });
})

//API to retrieve represenative information
//JSON request needs nothing
//Returns both Virginia represenative's firstName, lastName, imageURL, email, and party
app.post('/api/representativeInfo', (req, res) => {
    representatives.find({}).toArray(function(err, repList) {
        if (err) throw err;
        console.log(repList)
        delete repList[0]['state']
        delete repList[0]['bills']
        delete repList[1]['state']
        delete repList[1]['bills']
        res.send(repList)
    });
})

//API to retrieve represenative voting history
//JSON request needs bill id
//Returns both Virginia represenative's voteDate, and voteYes for that bill
app.post('/api/representativeVotingHistory', (req, res) => {
    let json = req.body
    billId = json.billId
    state = json.state
    representatives.find({"bills.billId":billId}).toArray(function(err, repList) {
        if (err) throw err;
        vote1 = null
        vote2 = null
        if(repList[0] == undefined){
            res.send("no Bill was found")
        }
        else{
            billList1 = repList[0]['bills']
            for(bid in billList1){
                specificBill = billList1[bid]
                if(specificBill['billId'] == billId){
                    vote1 = specificBill
                }
            }
            billList2 = repList[1]['bills']
            for(bid in billList2){
                specificBill = billList2[bid]
                if(specificBill['billId'] == billId){
                    vote2 = specificBill
                }
            }
            result = [vote1,vote2]
            res.send(result)
        }
    });
})

//API to retrieve represenative voting history
//JSON request needs nothing
//Returns both Virginia represenative's voteDate, and voteYes for all bills
app.post('/api/totalVotingHistory', (req, res) => {
    representatives.find({}).toArray(function(err, repList) {
        if (err) throw err;
        billList1 = repList[0]['bills']
        billList2 = repList[1]['bills']
        res.send(billList1.concat(billList2))
    });
})

//API to retrieve bills that haven't been voted on yet
//JSON request needs nothing
//Returns array of all bills that haven't been voted yet
app.post('/api/unvotedBills', (req, res) => {
    bills.find({"repVoted":"false"}).toArray(function(err, result) {
        res.send(result);
    });
})

//API to retrieve all the bills a user hasn't voted on yet
//JSON request needs user email and token
//Returns array of bills that user hasn't voted on yet
app.post('/api/upcomingBills', (req, res) => {
    let json = req.body
    token = json.token
    email = json.email
    users.findOne({"email":email}, function(err, result) {
        if (err) throw err;
        if(!result.bills){
            bills.find({}).toArray(function(err, billList) {
                if (err) throw err;
                res.send(billList)
            });
        }
        else{
            billList = []
            for(billIndex in result.bills){
                billId = result.bills[billIndex].billId
                billList.push(billId)
            }
            answer = []
            bills.find({"bill_id":{$nin: billList}}).each(function(err,doc){
                answer.push(doc)
                if(doc == undefined){
                    answer.splice(-1,1)
                    res.send(answer)
                }
            });
        }
    });
})


//API to retrieve all the bills a user has voted on
//JSON request needs user email and token
//Returns array of bills that user has voted on
app.post('/api/pastBills', (req, res) => {
    let json = req.body
    token = json.token
    email = json.email
    users.findOne({"email":email}, function(err, result) {
        if (err) throw err;
        if(!result.bills){
            answer = []
            res.send(answer)
        }
        else{
            var promises = []
            for(billIndex in result.bills){
                billId = result.bills[billIndex].billId
                promises.push(bills.findOne({"bill_id":billId}))
            }
            Promise.all(promises).then(promiseList => {
                for(var i = 0;i<promiseList.length;i++){
                    for(billIndex in result.bills){
                        billId = result.bills[billIndex].billId
                        if(billId == promiseList[i]["bill_id"]){
                            promiseList[i]["votedYes"] = result.bills[billIndex].votedYes
                            promiseList[i]["voteDate"] = result.bills[billIndex].voteDate
                        }
                    }
                }
                res.send(promiseList)
            });
        }
    });
})

//API to vote or update a user vote on a bill and send an email to the representative
//JSON request needs user email, token, billId, votedYes
app.post('/api/billVote', (req, res) => {
    let json = req.body;
    token = json.token;
    email = json.email;
    billId = json.billId;
    votedYes = json.votedYes;
    voteDate = new Date(Date.now())
    billJson = {
        "billId":billId,
        "voteDate": voteDate,
        "votedYes": votedYes
    }
    users.updateOne({"email":email, "bills.billId":billId}, {$set: {"bills.$.votedYes": votedYes, "bills.$.voteDate": voteDate}}, function(err,doc) {
        if (err) {
            throw err;
        }
        if(doc['matchedCount'] == 0){
            users.updateOne({"email":email}, {$push: {"bills": billJson}}, function(err,doc) {
                if (err) {
                    throw err;
                }
            });
        }
      });
    
    var full_name = null
    users.findOne({"email":email}, function(err, result) {
        if (result == null){
            res.send("Email not found")
        }
        else{
            full_name = result.firstName + " " + result.lastName
            const spawn = require("child_process").spawn;
            const pythonProcess = spawn('python',["SendEmail.py", full_name, billId, votedYes]);
            res.sendStatus(200);
        }
    });
})

var firebaseConfig = {
    apiKey: "AIzaSyBq4Z7zkRzESTz5snCeVzvXrwC6L818z_w",
    authDomain: "omnia-ba948.firebaseapp.com",
    projectId: "omnia-ba948",
    storageBucket: "omnia-ba948.appspot.com",
    messagingSenderId: "96172612663",
    appId: "1:96172612663:web:4b426ad33f298e6056b3b2",
    measurementId: "G-DR8BG1ZL2L"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

app.listen(3000, function () {
    console.log('listening on 3000');
});
