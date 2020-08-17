const mongoose = require("mongoose"),
      passportLocalMongoose = require("passport-local-mongoose");


// USER SCHEMA

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", UserSchema);