const mongoose = require("mongoose");

const LicenseSchema = new mongoose.Schema({

    email:String,

    key:{
        type:String,
        unique:true
    },

    plan:String,

    hwid:{
        type:String,
        default:null
    },

    status:{
        type:String,
        default:"ACTIVE"
    },

    expiresAt:Date,

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports =
mongoose.model("License", LicenseSchema);