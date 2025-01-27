const qrcode = require("qrcode");
const sharp = require("sharp");
const axios = require("axios")

async function generateQRCode(content, options, file){
  const defaultoptions = {
    type: "image/svg",
    width: 400,
    margin: 2,
    scale: 2,
    errorCorrectionLevel: "H",
    color: {
      dark: "#000000", // Foreground color (QR code)
      light: "#FFFFFF", // Background color
    },
  };

  const finaloptions = {...defaultoptions, ...options,file};
  console.log(finaloptions)
  const qrCodeBuffer = await qrcode.toBuffer(content, finaloptions);
  if(finaloptions.logo || finaloptions.file){
    const qrimg = sharp(qrCodeBuffer); 
    let logoBuffer;

    // Check if logoPath is a URL
    if (finaloptions.logo) {
      try {
        // If it's a URL, fetch the logo image from the URL as a buffer
        const response = await axios.get(finaloptions.logo, {
          responseType: "arraybuffer",
        });
        logoBuffer = Buffer.from(response.data);
      } catch (err) {
        throw new Error("Failed to fetch logo from URL: " + err.message);
      }
    } else if (finaloptions.file) {
      logoBuffer = finaloptions.file.buffer;
    } else {
      throw new Error("Invalid logoPath, should be a URL or a valid File");
    }
    const logoimg = sharp(logoBuffer);
    const qrMetadata = await qrimg.metadata();
    const logoSize = Math.floor(qrMetadata.width / 4);
    const resizedLogo = await logoimg
      .resize(logoSize, logoSize, {
        fit: "inside"
      })
      .toBuffer();
    const finalImage = await qrimg
      .composite([
        {
          input: resizedLogo,
          top: Math.floor((qrMetadata.height - logoSize) / 2), 
          left: Math.floor((qrMetadata.width - logoSize) / 2), 
        },
      ])
      .toBuffer();

    return finalImage;
  }
  return qrCodeBuffer;
}

module.exports = generateQRCode