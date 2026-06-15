const mongoose = require("mongoose");

const PaymentSchema =
new mongoose.Schema({

    email:String,

    plan:String,

    amount:Number,

    paymentId:String,

    status:{
        type:String,
        default:"PENDING"
    },

    approvedAt:{
        type:Date,
        default:null
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports =
mongoose.model(
    "Payment",
    PaymentSchema
);