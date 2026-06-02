const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config();

const passport = require("passport");

///google strategy
require("./config/passport");


const session =
  require("express-session");

  
// DB CONNECT
const connectDB =
  require("./config/db");

connectDB();

// APP
const app = express();

// MIDDLEWARES

app.use(cors({

  origin: "http://localhost:5173",

  credentials: true,
}));


app.use(express.json());


app.use(

  session({

    secret: "googleauth",

    resave: false,

    saveUninitialized: false,
  })
);

app.use(passport.initialize());

app.use(passport.session());

// ROUTES

const emailRoutes =
  require("./routes/emailRoutes");

const authRoutes =
  require("./routes/authRoutes");


app.use(
  "/api/email",
  emailRoutes
);

app.use(
  "/api/auth",
  authRoutes
);



// TEST ROUTE

app.get("/", (req, res) => {

  res.send(
    "API Running..."
  );
});

// SERVER

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on ${PORT}`
  );
});