const express = require("express");
const path = require("path");
const fs = require("fs");

const User = require("../models/User");

const router = express.Router();

router.get("/:email", async (req,res)=>{

try{

    const user = await User.findOne({
        email:req.params.email
    });

    if(!user){

        return res.status(404).json({
            error:"Usuário não encontrado"
        });

    }

    const filePath = path.join(
        __dirname,
        "..",
        "files",
        "FPSBoosterSetup.exe"
    );

    if(!fs.existsSync(filePath)){

        return res.status(404).json({
            error:"Arquivo FPSBoosterSetup.exe não encontrado"
        });

    }

    user.downloads =
    (user.downloads || 0) + 1;

    await user.save();

    res.download(filePath);

}

catch(err){

    console.log(err);

    res.status(500).json({
        error:"Erro interno"
    });

    }


});

module.exports = router;
