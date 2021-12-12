const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const monrgan = require("morgan");
const exphbs = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDB = require("./config/db");

// Load config
dotenv.config({ path: "./config/config.env" });

// Passport config
require("./config/passport")(passport);

// Connect to database
connectDB();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(monrgan("dev"));
}

// Handlebars Middleware using .hbs extension
app.engine(".hbs", exphbs.engine({ extname: ".hbs", defaultLayout: "main" }));
app.set("view engine", ".hbs");

// Express Sessions Middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongooseConnection: mongoose.connection,
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Define static folder
app.use(express.static(`${__dirname}/public`));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  );
});
