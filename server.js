require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
<<<<<<< HEAD
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
=======
const cors = require("cors");

const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("site"));

// ================== CONFIG ==================

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("✅ Mongo conectado"))
.catch(err=> console.log(err));

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

const preferenceClient = new Preference(mp);
const paymentClient = new Payment(mp);

// ================== MODEL ==================

const licenseSchema = new mongoose.Schema({
  key: String,
  email: String,

  expiresAt: Date,

  refCode: String,
  referredBy: String,

  referrals: [String],
  referralsCount: { type: Number, default: 0 },

  banned: { type: Boolean, default: false },
  ip: String,

  createdAt: { type: Date, default: Date.now }
});

const License = mongoose.model("License", licenseSchema);

// ================== FUNÇÕES ==================

function generateKey(){
  return Math.random().toString(36).substring(2,10);
}

function generateRef(){
  return Math.random().toString(36).substring(2,8);
}

// ================== CREATE ==================

app.post("/create", async (req,res)=>{

  try{

    const { email, ref } = req.body;

    if(!email) return res.json({ error:"Email obrigatório" });

    // anti-fraude básico
    const existingIP = await License.findOne({ ip: req.ip });
    if(existingIP){
      return res.json({ error:"Já existe conta nesse IP" });
    }

    const key = generateKey();
    const refCode = generateRef();

    const user = await License.create({
      key,
      email,
      refCode,
      referredBy: ref || null,
      ip: req.ip
    });

    // contabilizar indicação
    if(ref){
      const refUser = await License.findOne({ refCode: ref });

      if(refUser && !refUser.referrals.includes(user.key)){
        refUser.referrals.push(user.key);
        refUser.referralsCount += 1;

        await refUser.save();
      }
    }

    res.json({ key });

  }catch(e){
    console.log(e);
    res.status(500).json({ error:"Erro ao criar" });
  }

});

// ================== PAY ==================

app.post("/pay", async (req,res)=>{

  try{

    const { key, plan } = req.body;

    const user = await License.findOne({ key });

    if(!user) return res.json({ error:"Usuário não encontrado" });
    if(user.banned) return res.json({ error:"Banido" });

    let price = 19.90;
    let duration = 30;

    if(plan === "3m"){ price = 49.90; duration = 90; }
    if(plan === "1y"){ price = 99.90; duration = 365; }

    const preference = await preferenceClient.create({
      body:{
        items:[{
          title:"FPS Booster",
          unit_price: price,
          quantity:1
        }],
        metadata:{ key, duration },
        notification_url: process.env.BASE_URL + "/webhook"
      }
    });

    res.json({ link: preference.init_point });

  }catch(e){
    console.log(e);
    res.json({ error:"Erro pagamento" });
  }

});

// ================== WEBHOOK ==================

app.post("/webhook", async (req,res)=>{

  try{

    if(req.body.type === "payment"){

      const paymentId = req.body.data.id;

      const payment = await paymentClient.get({ id: paymentId });

      if(payment.status === "approved"){

        const { key, duration } = payment.metadata;

        const user = await License.findOne({ key });

        if(user){

          user.expiresAt = new Date(Date.now() + duration*24*60*60*1000);
          await user.save();

          console.log("✅ Pagamento aprovado:", key);
        }
      }
    }

    res.sendStatus(200);

  }catch(e){
    console.log(e);
    res.sendStatus(500);
  }

});

// ================== USER ==================

app.get("/user", async (req,res)=>{

  const user = await License.findOne({ key: req.query.key });

  if(!user) return res.json({ error:"not found" });

  res.json({
    expiresAt: user.expiresAt,
    referrals: user.referralsCount,
    refCode: user.refCode
  });

});

// ================== START ==================
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
  console.log("🚀 Servidor rodando na porta " + PORT);
});
>>>>>>> fb6ddeb2b2c957d540d9ae5b7bc72eaa8d121d93
