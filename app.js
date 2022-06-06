  
let express = require('express');
let app = express();   
let bodyParser = require('body-parser');
let cors = require('cors')
let dotenv = require('dotenv');
dotenv.config();          

let port=process.env.PORT ||9870;
let mongo=require('mongodb')
let MongoClient= mongo.MongoClient;
let mongoUrl=process.env.MongoUrl;
// let MongoLiveUrl =process.env.MongoLiveUrl;
let db;

//Middleware (supporting lib)//
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(cors())

app.get('/',(req, res)=>{          
      res.send('Express Server Default')
})              

app.get('/items/:collections',(req, res)=>{
    db.collection(req.params.collections).find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result); 
    })
})

app.get('/location/',(req, res)=>{         
        db.collection('location').find().toArray((err,result)=>{
                    if(err) throw err;
                    res.send(result); 
                }) 
}) 

app.get('/quickSearch',(req, res)=>{     
    res.send(quickSearch)
}) 

app.get('/mealType',(req,res)=>{
    db.collection('mealType').find().toArray((err,result) => {
    if(err) throw err;
    res.send(result)
    })
})

app.get('/restaurants',(req,res) => {
    let stateId = Number(req.query.stateId)
    let mealId = Number(req.query.mealId)
    let query = {}
    if(stateId && mealId){
      query = {state_id:stateId,'mealTypes.mealtype_id':mealId}
    }
    else if(stateId){
      query = {state_id:stateId}
    }else if(mealId){
      query = {'mealTypes.mealtype_id':mealId}
    }
        db.collection('restaurants').find(query).toArray((err,result) => {
            if(err) throw err;
            res.send(result)
  })
})

app.get(`/filter/:mealId`,(req,res)=>{
    let sort = {cost:-1}
    let mealId = Number(req.params.mealId)
    let cuisineId = Number(req.query.cuisineId)
    let lcost = Number(req.query.lcost)
    let hcost = Number(req.query.hcost)
    let query = {}
    if(req.query.sort)
    {
        sort={cost:req.query.sort}
    }
    if(lcost && hcost && cuisineId )
    {
    query={
      "mealTypes.mealtype_id":mealId,
      $and:[{cost:{$gt:lcost,$lt:hcost}}],
      "cuisines.cuisine_id":cuisineId
  }
}
    else if(lcost && hcost)
      query={
        "mealTypes.mealtype_id":mealId,
        $and:[{cost:{$gt:lcost,$lt:hcost}}]
    }
    else if(cuisineId)
    {
        query={
            "mealTypes.mealtype_id":mealId,
            "cuisines.cuisine_id":cuisineId
        }
    }
    else{

        query={
            "mealTypes.mealtype_id":mealId,
        }
    }
    db.collection('restaurants').find(query).sort(sort).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
        })
})



app.get('/menu',(req,res)=>{
    db.collection('menu').find().toArray((err,result) => { 
    if(err) throw err;
    res.send(result)
    })
})

// app.get('/details/:id',(req,res) => {
//     let id = mongo.ObjectId(req.params.id)  //if u want to search restaurant on obj id then this is required//
//     db.collection('restaurants').find({_id:id}).toArray((err,result) => {
//         if(err) throw err;
//         res.send(result)
//         })
// })

app.get('/menu/:id',(req,res) => {
    let id = Number(req.params.id) //on normal id //
    db.collection('menu').find({restaurant_id:id}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
        })
})

app.get('/orders',(req,res) => {
    let id = Number(req.params.id) //on normal id //
    let email =req.query.email
    let query={}
    if(email) {
        // query={email:email}
        query={email} ///in javascript//
    }
    db.collection('orders').find({query}).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
        })
})

//menu on basis of user selected items //
app.post('/menuItem',(req,res)=>{
    if(Array.isArray(req.body))
    {
        db.collection('menu').find({menu_id:{$in:req.body}}).toArray((err,result) => {
            if(err) throw error
            res.send(result)
        })
    }
    else{
        res.send('Invalid Input')
    }
})

app.post('/placeOrder',(req,res) =>{
    console.log(req.body)
    db.collection('orders').insert(req.body,(err,result) =>{
        if(err) throw error
        res.send(result)
    })

})

app.put('/updateOrder/:id',(req,res) => {
    let oid = Number(req.params.id);
    db.collection('orders').updateOne(
      {orderId:oid},
      {
        $set:{
          "status":req.body.status,
          "bank_name":req.body.bank_name,
          "date":req.body.date
        }
      },(err,result) => {
        if(err) throw err;
        res.send('Order Updated')
      }
    )
})

app.delete('/deleteOrder/:id',(req,res) =>{
    let oid =mongo.ObjectId(req.params.id)
    db.collection('orders').remove({_id:oid},(err,result) =>{
    if(err) throw err
    res.send('order deleted')
    })
})
//connect with db//
MongoClient.connect(mongoUrl,(err,client)=>{
    if(err) console.log('error while connecting');
        db=client.db('EdurInternFeb');
        app.listen(port,(err)=>{
            if(err) throw err;
            console.log(`Express server listening to port ${port}`)
      })
    
})
