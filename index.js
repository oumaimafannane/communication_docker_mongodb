const MongoClient = require('mongodb').MongoClient;

const bodyParser = require('body-parser'); 
const express = require('express') 
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://mongo:27017/docker_db', {
    useNewUrlParser: true
}).then(() => {
    console.log("Database Connected Successfully!!");    
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});


const etudiant = new MongoClient('mongodb://mongo:27017/docker_db', { useNewUrlParser: true, useUnifiedTopology: true });

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));


app.post('/index', async (req, res) => {
  const data = req.body;
  console.log(data)
 
  try {
    await etudiant.connect();
    console.log('Connected to MongoDB server');
    
    const collection = etudiant.db("docker_db").collection("etudiant");
    collection.insertOne(data, (err, result) => {
      if (err) throw err;
      console.log("Data inserted!");
      
      etudiant.close();
    });
    res.send('Data inserted succesfully !');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
  
});
const port = 3010
app.listen(port, () => console.log(`This app is listening on port ${port}`));