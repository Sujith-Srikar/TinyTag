import multer from "multer";

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024, 
    files: 1,
  },
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if(allowedTypes.includes(file.mimetype))
        cb(null, true);
    else  cb(
        new Error(
          "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed."
        ),
        false
      );
  }  
});

export {upload}