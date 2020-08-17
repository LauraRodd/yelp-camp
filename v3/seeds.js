const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment");

let data = [
    {
        name: "Summer Camp", 
        image: "https://images.unsplash.com/photo-1572930621326-f5297aeccc6b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Description of Camp"
    },
    {
        name: "Expats Camp", 
        image: "https://images.unsplash.com/photo-1439066290691-510066268af5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Description of Camp"
    },
    {
        name: "Friends Camp", 
        image: "https://images.unsplash.com/photo-1590256446678-51a8e0a3c70b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Description of Camp"
    }
];


function seedDB(){
    // REMOVE ALL CAMPGROUNDS
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed Campgrounds!");
        // ADD A FEW CAMPGROUNDS
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else {
                    console.log("campground added");
                    // CREATE A COMMENT
                    Comment.create(
                        {
                            text: "This place is great but internet connection not so good",
                            author: "Laura"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                                console.log("Created new comment");
                            }
                        });
                }
            });
        });
    });
 
}



module.exports = seedDB;