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
            return res.render("register", {"error": err.message});
        } 
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
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
    req.flash("info", "You are logged out!");
    res.redirect("/campgrounds");
});

module.exports = router;