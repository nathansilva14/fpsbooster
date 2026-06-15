const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer =
require("nodemailer");

const User = require("../models/User");

const router = express.Router();

function generateInviteCode(name){
    return (
        name.substring(0,3).toUpperCase() +
        Math.floor(Math.random()*99999)
    );
}

// CADASTRO

router.post("/register", async(req,res)=>{

    try{

        const {name,email,password,inviteCode} = req.body;

        const exists = await User.findOne({email});

        if(exists){
            return res.status(400).json({
                error:"Email já cadastrado"
            });
        }

        const hash = await bcrypt.hash(password,10);

        let inviter = null;

if(inviteCode){

    inviter = await User.findOne({
        inviteCode
    });

}

        const user = await User.create({

            name,
            email,
            password:hash,
            inviteCode:generateInviteCode(name)

        });

        res.json({
            success:true,
            user:user.email
        });

    }catch(err){

        res.status(500).json(err);

    }

    if(inviter){

    inviter.referrals += 1;

    await inviter.save();

}

});

// LOGIN

router.post("/login", async(req,res)=>{

    try{

        const {email,password} = req.body;

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                error:"Usuário não encontrado"
            });
        }

        const valid = await bcrypt.compare(
            password,
            user.password
        );

        if(!valid){
            return res.status(400).json({
                error:"Senha inválida"
            });
        }

        const token = jwt.sign(
    {
        id:user._id
    },
    process.env.JWT_SECRET
);

user.lastLogin = new Date();

await user.save();

        res.json({
            token,
            name:user.name,
            plan:user.plan
        });

    }catch(err){

        res.status(500).json(err);

    }

});

router.get("/test",(req,res)=>{
    res.json({
        status:"Auth funcionando"
    });
});

router.get("/user/:email", async (req,res)=>{

    try{

        const user = await User.findOne({
            email:req.params.email
        });

        if(!user){
            return res.status(404).json({
                error:"Usuário não encontrado"
            });
        }

        res.json({

    name:user.name,

    email:user.email,

    plan:user.plan,

    referrals:user.referrals,

    inviteCode:user.inviteCode,

    licenseKey:user.licenseKey,

    downloads:user.downloads,

    lastLogin:user.lastLogin

});

    }catch(err){

        res.status(500).json(err);

    }

});

router.get("/ranking", async(req,res)=>{

    try{

        const ranking = await User.find()

        .sort({
            referrals:-1
        })

        .limit(10)

        .select(
            "name referrals plan"
        );

        res.json(ranking);

    }catch(err){

        res.status(500).json(err);

    }

});

const License =
require("../models/License");

const Payment =
require("../models/Payment");

router.get(
"/admin/stats",

async(req,res)=>{

    try{

        const users =
        await User.countDocuments();

        const licenses =
        await License.countDocuments();

        const payments =
        await Payment.countDocuments();

        const paymentList =
        await Payment.find();

        let revenue = 0;

        paymentList.forEach(p=>{

            revenue +=
            p.amount || 0;

        });

        res.json({

            users,

            licenses,

            payments,

            revenue

        });

    }catch(err){

        res.status(500)
        .json(err);

    }

});
router.post(
"/forgot-password",

async(req,res)=>{

    try{

        const {
            email
        } = req.body;

        const user =
        await User.findOne({
            email
        });

        if(!user){

            return res.status(404)
            .json({
                error:"Email não encontrado"
            });

        }

        const transporter =
        nodemailer.createTransport({

            service:"gmail",

            auth:{

                user:
                process.env.EMAIL_USER,

                pass:
                process.env.EMAIL_PASS

            }

        });

        await transporter.sendMail({

            from:
            process.env.EMAIL_USER,

            to:email,

            subject:
            "Recuperação de Senha FPS Booster",

            html:`

            <h2>
            Recuperação de Senha
            </h2>

            <p>
            Sua conta foi localizada.
            </p>

            <p>
            Em uma versão futura,
            aqui estará o link de redefinição.
            </p>

            `

        });

        res.json({

            success:true,

            message:
            "Email enviado!"

        });

    }catch(err){

        res.status(500)
        .json(err);

    }

});

module.exports = router;