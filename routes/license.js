const express = require("express");

const License =
require("../models/License");

const User =
require("../models/User");

const generateLicense =
require("../utils/licenseGenerator");

const router =
express.Router();


// TESTE

router.get("/test",(req,res)=>{

    res.json({
        status:"License OK"
    });

});


// CRIAR LICENÇA

router.post("/create", async(req,res)=>{

    try{

        const {
            email,
            plan
        } = req.body;

        const user =
        await User.findOne({
            email
        });

        if(!user){

            return res.status(404)
            .json({
                error:"Usuário não encontrado"
            });

        }

        const key =
        generateLicense();

        const expiresAt =
        new Date();

        if(plan === "PRO_1"){

            expiresAt.setMonth(
                expiresAt.getMonth()+1
            );

        }
        else if(plan === "PRO_3"){

            expiresAt.setMonth(
                expiresAt.getMonth()+3
            );

        }
        else{

            expiresAt.setFullYear(
                expiresAt.getFullYear()+1
            );

        }

        const license =
        await License.create({

            email,

            key,

            plan,

            expiresAt

        });

        user.licenseKey =
        key;

        user.plan =
        plan;

        await user.save();

        res.json({

            success:true,

            key,

            expiresAt

        });

    }catch(err){

        res.status(500)
        .json(err);

    }

});


// MINHA LICENÇA

router.get(
"/my-license/:email",

async(req,res)=>{

    try{

        const license =
        await License.findOne({

            email:
            req.params.email

        });

        if(!license){

            return res.status(404)
            .json({
                error:"Sem licença"
            });

        }

        res.json(
            license
        );

    }catch(err){

        res.status(500)
        .json(err);

    }

});


// VALIDAR

router.post(
"/validate",

async(req,res)=>{

    try{

        const {
            key
        } = req.body;

        const license =
        await License.findOne({
            key
        });

        if(!license){

            return res.json({
                valid:false
            });

        }

        if(
            license.expiresAt <
            new Date()
        ){

            return res.json({
                valid:false,
                expired:true
            });

        }

        res.json({
            valid:true,
            plan:license.plan
        });

    }catch(err){

        res.status(500)
        .json(err);

    }

});

module.exports =
router;