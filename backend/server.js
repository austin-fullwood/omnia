// server.js
const express = require('express');
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();
var firebase = require("firebase/app");
require("firebase/auth");

/*CORS stands for Cross Origin Resource Sharing and allows modern web browsers to be able to send AJAX requests and receive HTTP responses for resource from other domains other that the domain serving the client side application.*/
const cors = require('cors');

var db = null
var users = null
var bills = null
MongoClient.connect('mongodb+srv://omnia:greencomputing@cluster0.g1kbr.mongodb.net/omnia?retryWrites=true&w=majority', {
    useUnifiedTopology: true
})
    .then(client => {
        console.log('Connected to Database')
        db = client.db('omnia')
        users = db.collection('users')
        bills = db.collection('bills')
    })
    .catch(error => console.error(error));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//CRUD Handlers
app.get('/', (req, res) => {
    //res.send('Hello World')
    res.sendFile(__dirname + '/index.html')
})

app.get('/reg', (req, res) => {
    //res.send('Hello World')
    res.sendFile(__dirname + '/register.html')
})

app.get('/test', (req, res) => {
    //res.send('Hello World')
    res.sendFile(__dirname + '/test.html')
})

app.post('/user/register', (req, res) => {
    let json = req.body;
    email = json.email;
    password = json.password;

    if (users.findOne({"email":email})) {
        res.status(409);
        res.send('Email is linked to another user.');
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            var token = null
            user.getIdToken(true).then(function(idToken){
                res.send({'token':idToken})
                token = idToken
            }).catch(function(error) {
                // Handle error
            });
            delete json['password']
            users.insertOne(json)
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            res.status(errorCode);
            res.send(errorMessage)
        });
})

app.post('/user/signin', (req, res) => {
    let json = req.body
    email = json.email;
    password = json.password;
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in 
            var user = userCredential.user;
            user.getIdToken(true).then(function(idToken){
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

app.post('/user/data', (req, res) => {
    let json = req.body
    token = json.token
    users.findOne({"email":email}, function(err, result) {
        if (err) throw err;
        res.send(result)
    });
})

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
            Promise.all(promises).then(result => {
                res.send(result)
            });
        }
    });
})

app.post('/api/billVote', (req, res) => {
    let json = req.body;
    token = json.token;
    email = json.email;
    billId = json.billId;
    votedYes = json.votedYes;
    billJson = {
        "billId":billId,
        "voteDate": new Date(Date.now()),
        "votedYes": votedYes
    }
    users.updateOne({"email":email}, {$push: {"bills": billJson}}, function(err,doc) {
        if (err) {
            throw err;
        }
        res.status(200);
        res.json({});
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
