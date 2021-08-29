import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import exphbs from "express-handlebars";
import route from "./routes/route.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import passport from "passport";
import passportfile from "./passport.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select
} from "./helpers/hbs.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

app.use(morgan("dev"));

// to use bodyparser
app.use(express.json());
app.use(express.urlencoded());

// passport config
passportfile(passport);

// sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    })
  })
);

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set gobal var for user
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// MONGODB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.engine(
  ".hbs",
  exphbs({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
    defaultLayout: "main",
    extname: ".hbs"
  })
);
app.set("view engine", ".hbs");

//static folder
app.use(express.static(path.join(__dirname, "public")));

// Route
app.use("/", route);

app.listen(PORT, () => {
  console.log(`listening in ${process.env.NODE_ENV} in ${PORT}`);
});
