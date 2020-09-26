const express = require("express")
const bodyParser = require("body-parser")
const cors = require('cors')
const mongodb = require("mongodb")

const app = express();
const PORT = process.env.PORT || 8080;
const mongoClient = mongodb.MongoClient;
const url = "mongodb+srv://sid10on10:qwerty123@cluster0.fqer8.mongodb.net/usersTask?retryWrites=true&w=majority"


app.use(cors({
    origin : '*'
}))

app.use(bodyParser.json())

app.get("/",function(req,res){
    res.write("<h1>Root Endpoints are ----> </h1>")
    res.end()
})

app.get("/users",async function(req,res){
    let client;
    try {
        client = await mongoClient.connect(url)
        let db = client.db("usersTask")
        let users = await db.collection("users").find().toArray()
        client.close()
        res.json(users)
        res.end()   
    } catch (error) {
        client.close()
        console.log(error)
    }
})

app.post("/users",async function(req,res){
    let client;
    try {
        client = await mongoClient.connect(url)
        let db = client.db("usersTask")
        let {fname,lname,email} = req.body
        let user = await db.collection("users").findOne({email})
        if(!user){
            let inserted = await db.collection("users").insertOne({fname,lname,email})
            client.close()
            res.json({
                message:"User Created"
            })
        }else{
            client.close()
            res.json({
                message:"Email already exist"
            })
        }
        res.end()  
        client.close() 
    } catch (error) {
        client.close()
        console.log(error)
    }
})

app.put("/users",async function(req,res){
    let client;
    try {
        client = await mongoClient.connect(url)
        let db = client.db("usersTask")
        let {fname,lname,email} = req.body
        let user = await db.collection("users").findOne({email})
        if(user){
            await db.collection("users").findOneAndUpdate({email},{$set:{fname,lname}})
            client.close()
            res.json({
                message:"User Updated"
            })
        }else{
            client.close()
            res.json({
                message:"No user with this email"
            })
        }
    } catch (error) {
        client.close()
        console.log(error)
    }
})

app.delete("/users",async function(req,res){
    let client;
    try {
        client = await mongoClient.connect(url)
        let db = client.db("usersTask")
        let email = req.body.email
        let user = await db.collection("users").findOne({email})
        if(user){
            await db.collection("users").findOneAndDelete({email})
            client.close()
            res.json({
                message:"User Deleted"
            })
        }else{
            client.close()
            res.json({
                message:"No user with this email"
            })
        }
    } catch (error) {
        client.close()
        console.log(error)
    }
})



app.listen(PORT,()=>{
    console.log("Server is running at Port",PORT)
})