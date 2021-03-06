const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const monrgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
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

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(monrgan("dev"));
}

// Handlebars Helpers
const {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select,
} = require("./helpers/hbs");

// Handlebars Middleware using .hbs extension
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers: { formatDate, truncate, stripTags, editIcon, select },
  })
);
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

// Set global variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Define static folder
app.use(express.static(`${__dirname}/public`));

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  );
});
