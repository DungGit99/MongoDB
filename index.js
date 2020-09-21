var express = require('express');
var app = express();

app.set("view engine", "ejs");
app.set("views", "./views");
app.set(express.static("public"));

app.listen(5000)

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://DungCode99:nguyenvandung@cluster0.4wwov.mongodb.net/Mongodb?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
},function(err){
  if(!err) {
    console.log('😄 😄 😄');
  }else{
    console.log(err);
  }
});

const Cap1 = require('./Models/Cap1');
const Cap2 = require('./Models/Cap2');

app.get('/cap1/:name',function(req,res){
  var cap1 = new Cap1({
    name: req.params.name,
    kids: []
  });
  cap1.save(function(err){
    if(err) {
      res.json({ kq: 0});
    }else{
      res.json({ kq: 1});
    }
  });
})
app.get("/cap2/:idMe/:name",function(req,res){
  var cap2 = new Cap2({
    name: req.params.name
  });
  cap2.save(function(err){
    if(err){
      res.json({ kq: 0})
    }else {
      Cap1.findOneAndUpdate(
        {
          _id:req.params.idMe
        },
        {
          $push: {kids: cap2._id}
        },
        function(err){
          if(err) {
            res.json({ kq: 0});
          }else{
            res.json({ kq: 1});
          }
        }
      )
    }
  });
})

app.get('/', function(req,res){
  res.send("okay")
});