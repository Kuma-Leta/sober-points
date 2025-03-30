require("dotenv").config();
const express = require("express");
const app = express();
const Routes = require("./routes/router");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 5000;
const cron = require("node-cron");

app.use(cookieParser());
app.set("trust proxy", 1);
app.use(express.json());
app.use(bodyParser.json());
require("./config/db");
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174", "http://localhost:3000",
      "https://sober-frontend.onrender.com",
    ],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use("/api", Routes);
app.use("/uploads", express.static("uploads"));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.listen(PORT, () => {
  console.log(`Server running on ${PORT} port`);
});
