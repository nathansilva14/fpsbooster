const mongoose = require("mongoose");

const FraudLogSchema = new mongoose.Schema({

    email:String,

    inviteCode:String,

    reason:String,

    ip:String,

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports =
mongoose.model("FraudLog", FraudLogSchema);