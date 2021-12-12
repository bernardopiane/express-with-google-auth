const express = require("express");
const dotenv = require("dotenv");
const monrgan = require("morgan");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");

// Load config
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(monrgan("dev"));
}

// Handlebars Middleware using .hbs extension
app.engine(".hbs", exphbs.engine({ extname: ".hbs", defaultLayout: "main" }));
app.set("view engine", ".hbs");

// Define static folder
app.use(express.static(`${__dirname}/public`));

// Routes
app.use("/", require("./routes/index"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  );
});
