const express = require("express");
const cors = require('cors')

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;



//middleware
const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
}
app.use(cors(corsOptions))
app.use(express.json())

app.get('/', (req, res) => {
    res.send('AirCNC Server is running..')
  })

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pjz0bfk.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const usersCollection = client.db('aircncDb').collection('users')
    const roomsCollection = client.db('aircncDb').collection('rooms')
    const bookingsCollection = client.db('aircncDb').collection('bookings')

  // save user email and role in Db
  app.put('/users/:email',async(req,res)=>{
  const email = req.params.email;
  const user = req.body;
  console.log(user)
  const query = {email : email}
  const options ={upsert : true}
  const updateDoc = {
    $set : user 
  }
  const result = await usersCollection.updateOne(query,updateDoc,options);
  console.log(result);
  res.send(result)
})

//get a user 

app.get('/users/:email',async(req,res)=>{
  const email = req.params.email;
  const query = {email:email}
  const result = await usersCollection.findOne(query);
  res.send(result)
 })
// get all rooms 
 app.get('/rooms',async(req,res)=>{
 const result = await roomsCollection.find().toArray()
 res.send(result)
})

// get  rooms
 app.get('/rooms/:email',async(req,res)=>{
  const email = req.params.email;
  const query = {'host.email' : email}
  const result = await roomsCollection.find(query).toArray();
  res.send(result)
})
// get a single room 
app.get('/room/:id',async(req,res)=>{
 const id = req.params.id;
 const query = {_id: new ObjectId(id)}
 const result = await roomsCollection.findOne(query);
 res.send(result)
})

// delete a room 
app.delete('/rooms/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id : new ObjectId(id)}
  const result = await roomsCollection.deleteOne(query);
  res.send(result)
})
// post a room in database 
 app.post('/rooms',async(req,res)=>{
 const room = req.body;
 console.log('Room',room);
 const result = await roomsCollection.insertOne(room);
 res.send(result)
})
// get a bookings for a guest 
 app.get('/bookings',async(req,res)=>{
  const email = req.query.email;
  if(!email){
    res.send([])
  }
  const query = {'guest.email' : email}
  const result = await bookingsCollection.find(query).toArray()
  res.send(result)
  
})
// save a  bookingInfo in database 

app.post('/bookings',async(req,res)=>{
  const booking = req.body;
  console.log('booking',booking);
  const result = await bookingsCollection.insertOne(booking);
  res.send(result)
 })
//  delete a booking 
 app.delete('/bookings/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id:new ObjectId(id)}
  const result = await bookingsCollection.deleteOne(query);
  res.send(result)
})
 //update room booking status in database 
 app.patch('/rooms/status/:id',async(req,res)=>{
  const id = req.params.id;
  const status = req.body.status
  const query = {_id : new ObjectId(id)}
  const updateDoc = {
    $set : {
      booked : status,
    }
  }
  const update = await roomsCollection.updateOne(query,updateDoc);
  res.send(update)

 })

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } 
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, ()=>{
  console.log(`AirCNC is running on port ${port}`);
})
