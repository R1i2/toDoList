const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const date=require(__dirname+"/views/node.js");
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
const listItems=[];
const workItems=[];
let newTodo="";
app.get("/",function(req,res){
    res.render("index",{listItem:date.getDay(),Todo:listItems});
});
app.get("/work",function(req,res){
    res.render("index",{listItem:"Work List",Todo:workItems});
})
app.get("/about",function(req,res){
    res.render("about");
})
app.post("/",function(req,res){
    newTodo=req.body.newItem;
    if(req.body.button==="Work List"){
        workItems.push(newTodo);
        res.redirect("/work");
    }
    else{
        listItems.push(newTodo);
        res.redirect("/")
    }
})
app.listen(process.env.PORT||3000,function(){
    console.log("port is on and listenning at 3000");
});