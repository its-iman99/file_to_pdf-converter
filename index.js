const express=require('express');
const fs=require('fs');
const multer=require('multer');
const libre= require('libreoffice-convert');
const app=express();
const path=require('path');
const { callbackify } = require('util');
var bodyParser = require('body-parser');

// const staticpath=path.resolve(__dirname);
const staticpath= "/home/aman/Codes/converter/converter_v2/public";

app.use(bodyParser.urlencoded( {extended: true} ));
app.use(bodyParser.json());



app.set("view engine", "ejs");
let outputpath;

var dest=__dirname+"/uploads";

// console.log(dest);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, dest);
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

app.get('/',(req,res) =>
{
    res.render(__dirname+"/home.ejs");
});
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
app.get('/pdf' ,(req,res) =>
{
    // res.send("hello there")
    res.render(__dirname+"/index.ejs",{title:"DOCX to PDF Converter - Free Media Tools"});
    // res.render('/index.ejs',{title:"DOCX to PDF Converter - Free Media Tools"})
});

const storefilefilter = function (req, file, callback)
{
    var ext=path.extname(file.originalname);
    // console.log(file.originalname);
    // if(ext !== '.odt')
    // {
    //     return callback("Extension not .odt");
    // }
    callback(null,true);
};  

const fileuploader= multer({ dest: 'uploads/' , fileFilter:storefilefilter});


app.post('/pdf', fileuploader.single('avatar'),(req,res) =>
{
    // if(req.file)
        // console.log(req.file.path);
    const file = fs.readFileSync(req.file.path);
    // console.log(file);

    dest = Date.now() + "output.pdf";
    // console.log(dest);

    libre.convert(file,'.pdf',undefined,(err,done) =>
    {
        if(err)
        {
            fs.unlinkSync(req.file.path)
            fs.unlinkSync(dest)

            res.send("some error there is : Yoda")
        }
        fs.writeFileSync(dest,done);

        res.download(dest, (err) =>
        {
            if(err)
            {
                fs.unlinkSync(req.file.path)
                fs.unlinkSync(dest)

                res.send("indeed error, master : obiwan Kenobi")
            }
            // res.send("error hai yaha");

            fs.unlinkSync(req.file.path)
            fs.unlinkSync(dest)
        } )
    }
    )
});
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


app.get('/todocx' ,(req,res) =>
{
    // res.send("hello there")
    res.render(__dirname+"/todocx.ejs",{title:"DOCX to PDF Converter - Free Media Tools"});
    // res.render('/index.ejs',{title:"DOCX to PDF Converter - Free Media Tools"})
});

// // const storefilefilter = (req,file,callback) =>
// // {
// //     var ext=path.extname(file.originalname);
// //     // if(ext !== '.docx')
// //     // {
// //     //     return callback("Extension not .odt");
// //     // }
// //     callback(null,true);
// // };  

// // const fileuploader= multer({ storage: storage , fileFilter: storefilefilter});


app.post('/todocx', fileuploader.single('avatar'),(req,res) =>
{
    if(req.file)
        console.log(req.file.path);

    // const file = fs.readFileSync(req.file.path,"utf-8");
    const file = fs.readFileSync(req.file.path);
    // console.log(file);

    dest = Date.now() + "output.docx";
    //console.log(dest);

    libre.convert(file,'.docx',undefined,(err,done) =>
    {
        if(err)
        {
            fs.unlinkSync(req.file.path)
            fs.unlinkSync(dest)

            res.send("some error there is : Yoda")
        }
        fs.writeFileSync(dest,done);

        res.download(dest, (err) =>
        {
            if(err)
            {
                fs.unlinkSync(req.file.path)
                fs.unlinkSync(dest)

                res.send("indeed error, master : obiwan Kenobi")
            }
            // res.send("error hai yaha");

            fs.unlinkSync(req.file.path)
            fs.unlinkSync(dest)
        })
    })
});






app.listen(8000,(req,res)=>
{
    console.log("listening at 8000");
});