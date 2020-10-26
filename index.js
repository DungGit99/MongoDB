var express = require('express');
var app = express();
var cors = require('cors')
var bodyParser = require("body-parser");
var moment = require("moment");
var nodemailer =  require('nodemailer');

app.set("view engine", "ejs");
app.set("views", "./views");
app.set(express.static("public"));

app.listen(5000)

app.use(bodyParser.urlencoded({ extended: false }));


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
// findOneUpdate : tìm 1 và update 
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

// Cấp 1 lookup qua cấp 2 
// Dùng populate khi cấp 2 có _idCha
app.get("/menu", function(req, res){
  var cap1 = Cap1.aggregate([{
      $lookup: {
        from: "cap2",
        localField: "kids",
        foreignField: "_id",
        as: "Con"
      }
    }],function(err, data){
        if(err){  
          console.log(err);
        }else{
          res.json(data)
          // res.render("home")  
        }
  });
  console.log(cap1);
  
})
// Access-Control-Allow-Origin 

app.get('/allow_cors',cors(),function(req,res, next){
  res.json({msg: 'This is CORS-enabled for a Single Route'})
})

// body-parser 
app.get('/body',(req, res) => {
  res.render("index", {
    message: "Please enter a message",
    date: "Time will be show"
  })
})
app.post("/", (req, res) => {
  res.render("index", {
      message: req.body.message,
      date: moment().format("YYYY-MM-DD HH:mm:ss")
  });
}); 
// send mail 
app.get('/mail', function(req, res) {
  res.render('mail', {
    mess: req.body.mess
  });
});
app.post('/send-mail', function(req, res) {
  //Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
  var transporter =  nodemailer.createTransport({ // config mail server
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
          user: 'nguyendungcode99@gmail.com', //Tài khoản gmail vừa tạo
          pass: 'nguyenvandung99' //Mật khẩu tài khoản gmail vừa tạo
      },
      tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
      }
  });
  var content = '';
  content += `
      <div style="padding: 10px; background-color: #003375">
          <div style="padding: 10px; background-color: white;">
              <h4 style="color: #0085ff">Gửi mail với nodemailer và express</h4>
              <span style="color: black">Đây là mail test</span>
          </div>
      </div>
  `;
  var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
      from: 'nguyendungcode99@gmail.com',
      to: req.body.mail,
      subject: 'Đổi Mật Khẩu',
      text: 'Your text is here',//Thường thi mình không dùng cái này thay vào đó mình sử dụng html để dễ edit hơn
      html: content //Nội dung html mình đã tạo trên kia :))
  }
  transporter.sendMail(mainOptions, function(err, info){
      if (err) {
          console.log(err);
          // req.flash('mess', 'Lỗi gửi mail: '+err); //Gửi thông báo đến người dùng
          res.redirect('/');
      } else {
          console.log('Message sent: ' +  info.response);
          // req.flash('mess', 'Một email đã được gửi đến tài khoản của bạn'); //Gửi thông báo đến người dùng
          res.redirect('/');
      }
  });
});

app.get('/', function(req,res){
  res.send("okay")
});