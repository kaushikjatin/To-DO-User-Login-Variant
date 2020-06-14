var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongoose=require("mongoose");
var passport=require('passport');
var methodOverride=require('method-override');
var LocalStrategy=require('passport-local');
var flash=require('connect-flash');

var todos=require('./models/todo');
var users=require('./models/user');
var MongoURI = "mongodb+srv://kaushikjatin:Password@cluster0-bsz6j.mongodb.net/<dbname>?retryWrites=true&w=majority";
mongoose.connect(MongoURI, { useUnifiedTopology: true, useNewUrlParser: true });


app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'))
app.use(express.static("public"));
app.use(flash());
app.use(require('express-session')
({
    secret:"This is a TODO app",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next)
{
    res.locals.user=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});
passport.use(new LocalStrategy(users.authenticate()));
passport.serializeUser(users.serializeUser());
passport.deserializeUser(users.deserializeUser());




app.get("/",function(req,res)
{
    res.render("landing_page");
})

app.get("/register",function(req,res)
{
  res.render("register");
})

app.get("/:id/todos",isLoggedin,function(req,res)
{
    users.findById(req.params.id).populate("todos").exec(function(err,user)
    {
        if(err)
          console.log(err);
        else 
        {
            res.render("index",{user:user})
        }
          
    })
})



app.post("/:id/todos/new",isLoggedin,function(req,res)
{
    
    var newtodo={'todo':req.body.todo};
    todos.create(newtodo,function(err,todo)
    {
        users.findById(req.params.id,function(err,user)
       {
         if(err)
          console.log(err);
         else 
         {
           if(todo)
           {
            user.todos.push(todo);
            user.save();
           }
           req.flash("success","TO-DO Successfully Added");
           res.redirect("/"+req.params.id+"/todos");   
         }
       })
        
    })
})


app.post("/:id/todos/:todoid/delete",isLoggedin,function(req,res)
{
    todos.findByIdAndDelete(req.params.todoid,function(err)
    {
        if(err)
          console.log(err);
        else 
        {
          req.flash("success","TO-DO Successfully Deleted")
          res.redirect("/"+req.params.id+"/todos");   
        }
          
    })
})

app.put("/:id/todos/:todoid/edit",isLoggedin,function(req,res)
{
    todos.findByIdAndUpdate(req.params.todoid,{'todo':req.body.todo},function(err,updatedtodo)
    {
        if(err)
          console.log(err);
        else 
        {
          req.flash("success","TO-DO Successfully Updated")
          res.redirect("/"+req.params.id+"/todos"); 
        }
            
    })
})




// AUTH ROUTES

app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) 
    {
      if (err) 
         { return next(err); }
      if (!user)
         { return res.redirect('/'); }
      req.logIn(user, function(err)
       {
        if (err) 
           { return next(err);}
        return res.redirect('/' + req.user._id+"/todos");
      });
    })(req, res, next);
  });
  

app.post("/register",function(req,res)
{
    var newuser=new users({username:req.body.username});
    users.register(newuser,req.body.password,function(err,user)
    {
        if(err)
        {
           req.flash("error",err.message);      
           res.redirect('/');
        }
        else 
        {
        passport.authenticate("local")(req,res,function()
        {
            req.flash("success","Welcome To Your TO-DO-TRACKER");
            res.redirect("/"+req.user._id+'/todos');
        })
        }
    })
})

app.get("/logout",isLoggedin,function(req,res)
{
    req.logout();
    res.redirect('/');
})

function isLoggedin(req,res,next)
{
    if(req.isAuthenticated())
       next();
    else 
       res.redirect('/');
}


app.listen(3000);