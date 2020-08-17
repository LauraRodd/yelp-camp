const express = require("express"),
      router  = express.Router(),
      Campground = require("../models/campground"),
      middleware = require("../middleware");

// CLOUDINARY REQUIREMENTS

const multer = require('multer');
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
const imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter})

const cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'djbu4o4zx', 
  api_key: 379278685769171, 
  api_secret: "pUyil2PFXFlkfKxSou1DDgW-gco"
});

// INDEX ROUTE
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

// CREATE ROUTE
router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res){
    cloudinary.v2.uploader.upload(req.file.path, function(result){
        // add cloudinary url for the image to the campground object under image property
            req.body.campground.image = result.secure_url;
            // add author to campground
            req.body.campground.author = {
              id: req.user._id,
              username: req.user.username
            }
            Campground.create(req.body.campground, function(err, campground) {
              if (err) {
                req.flash('error', err.message);
                return res.redirect('back');
              }
              res.redirect('/campgrounds/' + campground.id);
            });
          });
        });




//Get data from the form an add to campgrounds array
// const name = req.body.name;
// const price = req.body.price;
// const image = req.body.image = result.secure_url;
// const desc = req.body.description;
// const author = {
//     id: req.user._id,
//     username: req.user.username
// };
// const newCampground = {name: name, price: price, image: image, description: desc, author: author};
// // Create new campground and save to database
// Campground.create(newCampground, function(err, newlyCreated){
//     if(err){
//         console.log(err);
//     } else {
//         console.log(newlyCreated);
//         res.redirect("/campgrounds");
//     }
// });
// });
// NEW ROUTE
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// SHOW ROUTE
router.get("/:id", function(req, res){
    // find campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found"); 
            res.redirect("back");           
        } else {
            console.log(foundCampground);
            // render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// EDIT ROUTE

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});     
        });
});

// UPDATE ROUTE

router.put("/:id", function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground updated");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DELETE ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;