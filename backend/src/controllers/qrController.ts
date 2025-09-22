import qrcode from "qrcode";
import sharp from "sharp";
import { type Request, type Response } from "express";

interface QROptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  logo?: string;
  file?: Express.Multer.File;
}

const LOGO_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  sizeRatio: 0.25, // 25% of QR code
  maxDimension: 200,
  timeout: 10000,
  allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
};

export default async function generateQR(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { content, dark, light } = req.body;
    const logoFile = req.file;
    const logoUrl =
      req.body.logo && typeof req.body.logo === "string"
        ? req.body.logo
        : undefined;

    // Build options from request
    const options: QROptions = {
      color: {
        dark: dark || "#000000",
        light: light || "#FFFFFF",
      },
      width: 400,
      margin: 2,
      logo: logoUrl,
      file: logoFile,
    };

    const qrBuffer = await QRService.generateQR(content, options);

    res.set({
      "Content-Type": "image/png",
      "Content-Length": qrBuffer.length.toString(),
      "Cache-Control": "no-cache",
    });

    res.send(qrBuffer);
  } catch (error) {
    console.error("QR Generation Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate QR code",
    });
  }
}

class QRService {
  private static DEFAULT_OPTIONS = {
    type: "image/png",
    width: 400,
    margin: 2,
    errorCorrectionLevel: "H" as const,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  };

  public static async generateQR(
    content: string,
    options: QROptions = {}
  ): Promise<Buffer> {
    const qrOptions = {
      ...this.DEFAULT_OPTIONS,
      ...options,
      color: {
        ...this.DEFAULT_OPTIONS.color,
        ...options.color,
      },
      type: "png" as const, // ensure type is the literal "png"
    };

    // Remove properties not accepted by qrcode.toBuffer
    const { logo, file, ...qrCodeOptions } = qrOptions;

    const qrBuffer = await qrcode.toBuffer(content, qrCodeOptions);

    if (options.logo || options.file) {
      return await this.addLogoToQR(qrBuffer, options);
    }

    return qrBuffer;
  }

  private static async addLogoToQR(
    qrBuffer: Buffer,
    options: QROptions
  ): Promise<Buffer> {
    const qrImage = sharp(qrBuffer);
    const qrMetadata = await qrImage.metadata();

    let logoBuffer: Buffer;

    if (options.logo) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          LOGO_CONFIG.timeout
        );

        const response = await fetch(options.logo, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch logo: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !LOGO_CONFIG.allowedTypes.includes(contentType)) {
          throw new Error(`Unsupported logo format: ${contentType}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        logoBuffer = Buffer.from(arrayBuffer);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to fetch logo: ${message}`);
      }
    } else if (options.file) {
      if (options.file.size > LOGO_CONFIG.maxSize) {
        throw new Error("File size exceeds maximum allowed size");
      }

      if (!LOGO_CONFIG.allowedTypes.includes(options.file.mimetype)) {
        throw new Error(`Unsupported file format: ${options.file.mimetype}`);
      }

      logoBuffer = options.file.buffer;
    } else {
      throw new Error("No logo provided");
    }

    // Resize logo
    const logoSize = Math.floor(qrMetadata.width! * LOGO_CONFIG.sizeRatio);
    const finalLogoSize = Math.min(logoSize, LOGO_CONFIG.maxDimension);

    const resizedLogo = await sharp(logoBuffer)
      .resize(finalLogoSize, finalLogoSize, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();

    // Center the logo
    const logoMetadata = await sharp(resizedLogo).metadata();
    const top = Math.floor((qrMetadata.height! - logoMetadata.height!) / 2);
    const left = Math.floor((qrMetadata.width! - logoMetadata.width!) / 2);

    return await qrImage
      .composite([{ input: resizedLogo, top, left }])
      .toBuffer();
  }
}
