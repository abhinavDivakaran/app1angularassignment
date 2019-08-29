const Express=require('express');
var app= Express();

var bodyparser = require('body-parser');

const Mongoose=require('mongoose');

var request=require('request');

app.set('view engine','ejs');

app.use(Express.static(__dirname+"/public"));

app.use(bodyparser.json());

app.use(bodyparser.urlencoded({extended:true}));

// For CORS,Pgm Line no 12 to 29
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200' );

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


const movie=Mongoose.model("moviecollection",{
    movie:String,
    actor:String,
    actress:String,
    director:String 
});


Mongoose.connect("mongodb://localhost:27017/moviedb");

app.get('/',(req,res)=>{

    res.render("index");
});

////////////////////////////////////////////////// INSERT /////////////////////////////////////////////////////////

app.post('/insert',(req,res)=>{

    console.log(req.body);

    var movieobj=new movie(req.body);
    var result=movieobj.save((error,data)=>{
        console.log("user Added");
    });
});

//////////////////////////////////////////////////////// get data //////////////////////////////////////////////////////

app.get('/getdata',(req,res)=>{
    result=movie.find((error,data)=>{
        if(error){
            throw error;
        }
        else{
            res.send(data);
        }
    }

    )});

//////////////////////////////////////////////////////////  View /////////////////////////////////////////////////////

const getdataapi="http://localhost:3456/getdata"

app.get('/view',(req,res)=>{
   
    request(getdataapi,(error,response,body)=>{
        var data=JSON.parse(body);

        console.log(data)

        res.render('view',{'data':data});


    });
});

/////////////////////////////////////////////////////////// Search /////////////////////////////////////////////////

app.post('/search',(req,res)=>{
    var id=req.body.actor;
    movie.find({actor:id},(error,data)=>{
        if(error){
            throw error;
        }
        else{
            console.log(data);
            res.send(data);
        }
    });
});

////////////////////////////////////////////////////////////// Porting ////////////////////////////////////////////
app.listen(process.env.PORT || 3456,()=>{
    console.log("Working Server...::3456...");
}); 
