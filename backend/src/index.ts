import express from "express";
import cors from "cors";

import qrRoute from "./routes/qrRoutes";
import urlRoute from "./routes/urlRoutes";

const app = express();
const PORT = process.env.PORT;

const corsoptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://tiny-tag.vercel.app",
    "https://www.tinytag.xyz",
    "https://tinytag.xyz",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsoptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/qr", qrRoute);
app.use("/api/url", urlRoute);

app.listen(PORT, () => console.log(`Server running on ${PORT}`));