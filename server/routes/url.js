const URL = require("../config")
const express = require("express")
const router = express.Router()
const {
  shortUrlGenerator,
  getLongUrl,
  handleGetAnalytics,
} = require("../controllers/url");

router.post("/generateurl", async (req, res) => {
  const orgurl = req.body.content;
  const shorturl = await shortUrlGenerator(orgurl);
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

module.exports = router