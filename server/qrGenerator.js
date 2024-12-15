// const QRCode = require("qrcode");
// const Jimp = require("jimp");

// async function generateQRCode(content, options = {}) {
//   const {
//     width = 300,
//     margin = 2,
//     color = "#000000",
//     logoPath
//   } = options;

//   // Generate the QR code in PNG format
//   const qrCodeBuffer = await QRCode.toBuffer(content, {
//     width,
//     margin,
//     color: {
//       dark: color, // Dark color of the QR code
//       light: "#FFFFFF", // Background color
//     },
//   });

//   console.log(await QRCode.create("Hello", options ));

//   if (logoPath) {
//     // Add logo to the QR code
//     const qrImage = await Jimp.read(qrCodeBuffer);
//     const logo = await Jimp.read(logoPath);

//     // Resize the logo to fit within the QR code
//     logo.resize(qrImage.bitmap.width / 4, Jimp.AUTO);

//     // Calculate position for the logo (centered)
//     const x = (qrImage.bitmap.width - logo.bitmap.width) / 2;
//     const y = (qrImage.bitmap.height - logo.bitmap.height) / 2;

//     // Composite the logo onto the QR code
//     qrImage.composite(logo, x, y);

//     return await qrImage.getBufferAsync(Jimp.MIME_PNG);
//   }

//   return qrCodeBuffer; // Return the QR code without a logo
// }

// module.exports = generateQRCode;

const qrcode = require("qrcode");
const sharp = require("sharp");
const axios = require("axios")

async function generateQRCode(content, options){
  const defaultoptions = {
    type:"img/jpeg",
    width: 400,
    margin: 2,
    scale: 2,
    errorCorrectionLevel: "H",
    logoPath: null
  }

  const finaloptions = {...defaultoptions, ...options};
  const qrCodeBuffer = await qrcode.toBuffer(content, finaloptions);
  if(finaloptions.logoPath){
    const qrimg = sharp(qrCodeBuffer); 

    let logoBuffer;

    // Check if logoPath is a URL
    if (
      finaloptions.logoPath.startsWith("http://") ||
      finaloptions.logoPath.startsWith("https://")
    ) {
      try {
        // If it's a URL, fetch the logo image from the URL as a buffer
        const response = await axios.get(finaloptions.logoPath, {
          responseType: "arraybuffer",
        });
        logoBuffer = Buffer.from(response.data);
      } catch (err) {
        throw new Error("Failed to fetch logo from URL: " + err.message);
      }
    } else if (finaloptions.logoPath.startsWith("data:image/")) {
      // If it's a base64 string, convert it to a buffer
      const matches = finaloptions.logoPath.match(
        /^data:image\/([a-zA-Z]*);base64,([^\"]+)$/
      );
      if (matches && matches.length === 3) {
        logoBuffer = Buffer.from(matches[2], "base64");
      } else {
        throw new Error("Invalid base64 string for logo");
      }
    } else {
      throw new Error("Invalid logoPath, should be a URL or base64 string");
    }

    const logoimg = sharp(logoBuffer);
    const qrMetadata = await qrimg.metadata();
    const logoSize = Math.floor(qrMetadata.width / 5);
    const resizedLogo = await logoimg.resize(logoSize, logoSize).toBuffer();
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
  return qrCodeBuffer
}

module.exports = generateQRCode