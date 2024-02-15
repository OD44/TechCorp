const mongoose = require('mongoose')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const {Schema, model} = mongoose

const UserSchema = new Schema({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    resetToken: String,
    resetExpires: Date
},
    {timestamps: true}
);


UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", UserSchema);

passport.use(User.createStrategy())

// SERIALIZE user
passport.serializeUser(User.serializeUser())

// DESERIALIZE USER

passport.deserializeUser(User.deserializeUser())

module.exports = User;