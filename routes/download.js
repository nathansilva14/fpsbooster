const express = require("express");
const path = require("path");

const User = require("../models/User");

const router = express.Router();

// DOWNLOAD DO APP

router.get("/:email", async (req, res) => {

    try {

        const user = await User.findOne({
            email: req.params.email
        });

        if (!user) {

            return res.status(404).json({
                error: "Usuário não encontrado"
            });

        }

        // Verifica expiração do plano

        if (
            user.plan !== "FREE" &&
            user.planExpires &&
            new Date(user.planExpires) < new Date()
        ) {

            return res.status(403).json({
                error: "Licença expirada"
            });

        }

        user.downloads =
            (user.downloads || 0) + 1;

        await user.save();

        const filePath = path.join(
            __dirname,
            "..",
            "files",
            "FPSBoosterSetup.exe"
        );

        res.download(filePath);

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Erro interno"
        });

    }

});

module.exports = router;