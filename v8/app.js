const express       = require("express"),
      app           = express(),
      bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      Campground    = require("./models/campground"), 
      Comment       = require("./models/comment"),
      User          = require("./models/user"),
      seedDB        = require("./seeds")

const commentRoutes     = require("./routes/comments"),
      campgroundRoutes  = require("./routes/campgrounds"),
      indexRoutes       = require("./routes/index");            


//CONNECT MONGOOSE TO SERVER
mongoose.connect("mongodb://localhost/yelp_camp_v8", {useNewUrlParser: true, useUnifiedTopology: true});
// ========================

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// // Seed the database
// seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "Hi I'm Secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// REQUIRING ROUTES
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// SERVER LISTEN PORT
app.listen(3000, function() { 
    console.log('YelpCamp App Server Has Started!'); 
  });