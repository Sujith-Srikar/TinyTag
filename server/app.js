const express = require("express")
const app = express()
const cors = require("cors")
const generateQRCode = require("./qrGenerator")
const bodyParser = require("body-parser")
const multer = require("multer")
const urlroute = require("./routes/url")
const PORT = process.env.PORT || 8000
require("dotenv").config();

app.use(cors())
app.use(bodyParser.json())

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); 

app.post("/generateqr",upload.single('logo'), async (req, res) => {
  const {content, ...options} = req.body;
  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }
  try{
    const qrcode = await generateQRCode(content, options, req.file)
    res.set("Content-Type", "image/jpeg");
    res.status(200).send(qrcode);
  }
  catch(err){
    console.log(err);
    res.status(500).send(`Failed to generate qrcode, ${err}`);
  }
})

app.use("/", urlroute);


app.listen(PORT)