// jshint esversion: 6
const express         = require("express"),
    bodyParser      = require("body-parser"),
    app             = express(),
    mongoose        = require('mongoose'),
    methodOverride  = require('method-override');
    

// APP CONFIG
mongoose.connect('mongodb://localhost/emon_v0', {useMongoClient: true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));



// MONGOOSE CONFIG
const usersSchema = new mongoose.Schema({
  name: String,
  country: String,
  age: Number,
  city: String,
  email: String,
  image: String,
  description: String,
  created: {type: Date, default: Date.now}
});
const User = mongoose.model("User", usersSchema);

// creates a new user manually
// User.create({
//   name: 'test',
//   country: 'brazil',
//   age: 21,
//   city: 'porteirinha',
//   email: 'emersondeivson13@gmail.com',
//   image: "https://codeinstitute.net/wp-content/uploads/2014/10/students-and-laptops.jpg",
//   description: 'this is the best social network i\'ve ever seen!'
// });


// ROUTES
// LANDING PAGE
app.get("/", function(req, res){
  res.render("landing");
});



// LOGIN
app.get("/login", function(req, res){
  res.render("login");
});



// REGISTER
app.get("/users/new", function(req, res){
  res.render("new");
});



// CREATE ROUTE
app.post("/users", function(req, res){
  // GET THE DATA FROM THE FORM/CREATE A NEW USER
  User.create(req.body.user, function(err, newUser) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("users");
    }
  });
});



// SHOW ALL PROFILES
app.get("/users", function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render("users/users", {users: users});
    }
  });
});



// SHOW EACH PROFILE
app.get("/user/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      res.render('users/user', {user: foundUser});
    }
  });
});


// EDIT USER
app.get("/user/:id/edit", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if (err) {
      res.redirect("/users");
    } else {
      res.render('users/edit', {user: foundUser});
      // res.send('working!');
    }
  });
});


// UPDATE USER 
app.put("/user/:id", function(req, res) {
  // you need there 3 arguments!
  User.findByIdAndUpdate(req.params.id, req.body.user, function(err, updateUser) {
    if (err) {
      res.render("users");
    } else {
      res.redirect("/user/" + req.params.id);
    }
  });
});













// SERVER
app.listen(process.env.PORT || 5000, function(){
  console.log("Server is running on port 5000");
});