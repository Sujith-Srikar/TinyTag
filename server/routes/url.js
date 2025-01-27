const URL = require("../config")
const express = require("express")
const router = express.Router()
const {
  shortUrlGenerator,
  getLongUrl,
  handleGetAnalytics,
  editLinkDestination,
  createAlias
} = require("../controllers/url");

router.post("/generateurl", async (req, res) => {
  const longurl = req.body.longUrl;
  const shorturl = await shortUrlGenerator(longurl);
  res
    .status(200)
    .json({ message: "URL added successfully", shorturl: shorturl });
});

router.get("/:shorturl", async (req, res) => {
  getLongUrl(req.params.shorturl)
    .then((url) => res.redirect(url))
    .catch((err) => {
      res.status(404).send(`ShortURL not found: ${err.message}`);
    })
})

router.get("/analytics/:shorturl", async (req, res) => {
  const shorturl = req.params.shorturl;
  try {
    const analytics = await handleGetAnalytics(shorturl);
    res.status(200).json(analytics);
  } catch (err) {
    res.status(404).send(`ShortURL not found: ${err.message}`);
  }
})

router.post("/editlinkdestination", async (req, res) => {
  const {shorturl, newLongUrl} = req.body;
  try {
    const result = await editLinkDestination(shorturl, newLongUrl);
    res.status(200).send(result);  
  } catch (error) {
    res.status(404).send(error.message);
  }
})

router.post("/createAlias",async (req, res)=>{
  const {shortCode, longUrl} = req.body;
  try {
    const result = await createAlias(shortCode, longUrl);
    res.status(200).send(result);
  } catch (err) {
    console.log(err)
    return res.status(404).send(err.message);
  }
})

module.exports = router