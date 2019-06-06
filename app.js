var express      = require("express"),
    bodyParser   = require("body-parser"),
    flash       = require("connect-flash"),
    mongoose     = require("mongoose"),
    methodOverride=require("method-override"),
    Campground   = require("./models/campground"),
    Comment      = require("./models/comment"),
    seedDB       = require("./seeds"),
    passport     = require("passport"),
    LocalStrategy= require("passport-local"),
    User         = require("./models/user"),
    app          = express();
    
var commentsRoutes   = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    

// app config

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.static(__dirname+"/public"));
app.use(flash());
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended:true}));

// seedDB();

mongoose.connect("mongodb://localhost/saviour",{ useNewUrlParser: true });

//mongodb://rparaman:Geek123#@ds245772.mlab.com:45772/christcamp
app.use(require("express-session")({
    secret:"Rusty is the best cutest dog in the world!",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next ){
    res.locals.currentUser = req.user;
    res.locals.error     = req.flash("error");
    res.locals.success   = req.flash("success");
    next();
});

app.get("/", function(req, res){
    res.render("landing");
});


app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server connected !");
});
