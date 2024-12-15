const express = require("express")
const app = express()
const cors = require("cors")
const generateQRCode = require("./qrGenerator")
const bodyParser = require("body-parser")
const urlroute = require("./routes/url")
const PORT = process.env.PORT || 8000
require("dotenv").config();



app.use(cors())
app.use(bodyParser.json())

app.post("/generateqr",async (req, res) => {
  const {content, ...options} = req.body;
  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }
  try{
    const qrcode = await generateQRCode(content, options)
    res.set("Content-Type", "image/jpeg")
    res.status(200).send(qrcode);
  }
  catch(err){
    res.status(500).send(`Failed to generate qrcode, ${err}`);
  }
})

app.use("/generateurl", urlroute);


app.listen(PORT)