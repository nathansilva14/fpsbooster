require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended:true
}));

// SITE
app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);

// MONGODB
mongoose.connect(
    process.env.MONGO_URL
)
.then(()=>{

    console.log(
        "🟢 Mongo conectado"
    );

})
.catch(err=>{

    console.log(
        "❌ Erro Mongo",
        err
    );

});

// ROTAS
app.use(
    "/auth",
    require("./routes/auth")
);

app.use(
    "/payment",
    require("./routes/payment")
);

app.use(
    "/license",
    require("./routes/license")
);

app.use(
    "/download",
    require("./routes/download")
);

// DOWNLOAD APP
app.get(
    "/download",
    (req,res)=>{

        res.download(

            path.join(
                __dirname,
                "files",
                "FPSBoosterSetup.exe"
            )

        );

    }
);

// API APP
app.get(
    "/app/version",
    (req,res)=>{

        res.json({

            version:
            process.env.APP_VERSION,

            update:false

        });

    }
);

// STATUS
app.get(
    "/ping",
    (req,res)=>{

        res.json({

            status:"online",

            version:
            process.env.APP_VERSION

        });

    }
);

// HOME
app.get(
    "/",
    (req,res)=>{

        res.sendFile(

            path.join(
                __dirname,
                "public",
                "index.html"
            )

        );

    }
);

const PORT =
process.env.PORT || 3000;

app.listen(
    PORT,
    ()=>{

        console.log(
            `🚀 Servidor rodando na porta ${PORT}`
        );

    }
);