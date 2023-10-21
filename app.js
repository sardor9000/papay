console.log("web serverni boshlash");
const express = require("express");
const app = express();
const router = require("./router.js");
const router_bssr = require("./router_bssr");

let session = require("express-session");
const GridFSBucket = require("mongodb/lib/gridfs-stream/index.js");
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: "session",
});



// 1. Kirish code
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));



// 2. Session code
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 1000 * 60 * 30, // for 30 minutes
        },
        store: store,
        resave: true,
        saveUninitialized: true,
    })
);
app.use(function(req, res, next) {
    res.locals.member = req.session.member;
    next();
})

// 3. Views code 
app.set("views", "views");
app.set("view engine", "ejs");


// ROUTERLAR qaysi API bilan kelgan Addreesni qayerga borishini xal qiladi
// 4. Routing code 
app.use("/resto", router_bssr); // ananaviy 
app.use("/",  router);          // 

module.exports = app; 