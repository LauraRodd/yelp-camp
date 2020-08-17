const express    = require("express"),
      router     = express.Router(),
      passport   = require("passport"),
      User       = require("../models/user");



// ROOT ROUTE
router.get("/", function(req, res){
    res.render("landing");
});


// SHOW SIGN UP FORM
router.get("/register", function(req, res){
    res.render("register");
});

// SIGN UP LOGIC
router.post("/register", function(req, res){
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        } 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

// SHOW LOGIN FORM
router.get("/login", function(req, res){
    res.render("login");
});

// HANDLE SIGN IN
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), function(req, res){
});

// LOGOUT 
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

// MIDDLEWARE

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
};



module.exports = router;