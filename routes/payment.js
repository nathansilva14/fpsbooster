const express = require("express");

const User = require("../models/User");
const License = require("../models/License");
const Payment = require("../models/Payment");

const generateLicense =
require("../utils/licenseGenerator");

const router = express.Router();


// TESTE

router.get("/test",(req,res)=>{

    res.json({
        status:"Payment OK"
    });

});


// CRIAR PAGAMENTO

router.post("/create", async(req,res)=>{

    try{

        const { email, plan } = req.body;

        let amount = 0;

        if(plan === "PRO_1"){

            amount = 19.90;

        }else if(plan === "PRO_3"){

            amount = 45.00;

        }else if(plan === "PRO_YEAR"){

            amount = 99.90;

        }

        const payment = await Payment.create({

            email,
            plan,
            amount,
            status:"PENDING"

        });

        res.json({

            success:true,
            paymentId:payment._id,
            amount

        });

    }catch(err){

        res.status(500).json(err);

    }

});


// APROVAR PAGAMENTO

router.get("/approve/:id", async(req,res)=>{

    try{

        const payment =
        await Payment.findById(
            req.params.id
        );

        if(!payment){

            return res.json({
                error:"Pagamento não encontrado"
            });

        }

        const user =
        await User.findOne({
            email:payment.email
        });

        if(!user){

            return res.json({
                error:"Usuário não encontrado"
            });

        }

        let expiresAt =
        new Date();

        if(payment.plan === "PRO_1"){

            expiresAt.setMonth(
                expiresAt.getMonth()+1
            );

        }else if(payment.plan === "PRO_3"){

            expiresAt.setMonth(
                expiresAt.getMonth()+3
            );

        }else{

            expiresAt.setFullYear(
                expiresAt.getFullYear()+1
            );

        }

        payment.status = "APPROVED";
        payment.approvedAt = new Date();

        await payment.save();

        const key =
        generateLicense();

        await License.create({

            email:user.email,
            key,
            plan:payment.plan,
            expiresAt

        });

        user.plan = payment.plan;
        user.licenseKey = key;
        user.planExpires = expiresAt;

        await user.save();

        res.json({

            success:true,
            key,
            plan:user.plan,
            expiresAt

        });

    }catch(err){

        console.log(err);

        res.status(500).json({
            error:"Erro interno"
        });

    }

});

// APROVAR PAGAMENTO (TESTE PELO NAVEGADOR)

router.get("/approve/:id", async(req,res)=>{

    const payment =
    await Payment.findById(
        req.params.id
    );

    if(!payment){

        return res.json({
            error:"Pagamento não encontrado"
        });

    }

    payment.status = "APPROVED";
    payment.approvedAt = new Date();

    await payment.save();

    res.json({
        success:true,
        message:"Pagamento aprovado"
    });

});

module.exports = router;