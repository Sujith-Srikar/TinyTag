const URL = require("../config")
const express = require("express")
const router = express.Router()
const {
  shortUrlGenerator,
  getLongUrl,
  handleGetAnalytics,
  editLinkDestination,
  createAlias,
  deleteShortUrl
} = require("../controllers/url");

router.post("/generateurl", async (req, res) => {
  let shortCode;
  if(req.body.shortCode)
    shortCode = req.body.shortCode;
  const longurl = req.body.longUrl;
  let result;
  if(shortCode)
    result = await createAlias(shortCode, longurl);
  else result = await shortUrlGenerator(longurl);
  res
    .status(200)
    .json({ message: "URL added successfully", shorturl: result });
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
    return res.status(404).send(err.message);
  }
})

router.delete("/delete/:shorturl", async (req, res) => {
  try {
    const result = await deleteShortUrl(req.params.shorturl);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router