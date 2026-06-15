const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true
    },

    password:{
        type:String,
        required:true
    },

    plan:{
        type:String,
        default:"FREE"
    },

    planExpires:{
        type:Date,
        default:null
    },

    referrals:{
        type:Number,
        default:0
    },

    rewards:{
        type:Number,
        default:0
    },

    inviteCode:{
        type:String,
        unique:true
    },

    invitedBy:{
        type:String,
        default:null
    },

    avatar:{
        type:String,
        default:"default.png"
    },

    downloads:{
        type:Number,
        default:0
    },

    licenseKey:{
        type:String,
        default:null
    },

    lastLogin:{
        type:Date,
        default:Date.now
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports =
mongoose.model("User", UserSchema);