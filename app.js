const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const app=express();
mongoose.connect("mongodb://localhost:27017/itemsDB");
const itemSchema= new mongoose.Schema({
    name:{
     type:String,
    requires:[true,"Why no name"]
}});
const Item=mongoose.model("Item",itemSchema);

const item=new Item({
    name:"This is a todo list"
});
const item1=new Item({
    name:"Press + add an item"
});
const item2=new Item({
    name:"<-- Click this to delete an item"
});

const workSchema=new mongoose.Schema({
    name:{
        type:String,
        requires:[true,"Work title is required"]
}});
const Work=mongoose.model("Work",workSchema);
const work=new Work({
    name:"Coding"
});
const work1=new Work({
    name:"Study"
});

const defaultWorkItem=[work,work1];
const defaultItem=[item,item1,item2];

app.use(express.static("public"));

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
   Item.find({},function(err,foundItems){
       if(foundItems.length===0)
       {
           Item.insertMany(defaultItem,function(err){
               if(err){
                   console.log(err)
               }
               else{
                   console.log("Successfully updated");
               }
           })
           res.redirect("/");
       }
       else
       {
           res.render("index",{listItem:"today",Todo:foundItems});
       }
   })
});

app.get("/work",function(req,res){
    Work.find({},function(err,results){
        if(results.length===0)
        {
            Work.insertMany(defaultWorkItem,function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Successfully updated work field");
                }
                res.render("index",{listItem:"Work List",Todo:results});
            })
        }
        else
        {
            res.render("index",{listItem:"Work List",Todo:results});
        }
    });
});

app.get("/about",function(req,res){
    res.render("about");
})
app.post("/",function(req,res){
    const newTodo=req.body.newItem;
    if(req.body.button==="Work List"){
        const work = new Work({
            name:req.body.newItem,
        });
       work.save();
        Work.find({},function(e,foundElement){
            res.redirect("/work");
        });
    }
    else{
        const item = new Item({
            name:req.body.newItem,
        });
        item.save();
        Item.find({},function(e,foundElement){
            res.redirect("/");
        });
    }
});
app.post("/delete",function(req,res){
    if(req.body.listItem==="today"){
    Item.findByIdAndRemove(req.body.checkbox,function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("successfully deleted");
            res.redirect("/");
        }
    })}
    else
    {
        Work.findByIdAndRemove(req.body.checkbox,function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("successfully deleted");
                Work.find({},function(e,foundElement){
                    res.render("index",{listItem:"Work List",Todo:foundElement});
                });
            }
        })  
    }
});
app.listen(3000,function(){
    console.log("port is on and listenning at 3000");
});