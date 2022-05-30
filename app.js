const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const File = require('./model/examfile');
const multer = require('multer');

const app = express();

app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(`${__dirname}/public`));


app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true,}));
app.use(morgan('dev'));

process.on("uncaughtException", (err) => {
    console.log("UNCAUGHT EXCEPTION, APP SHUTTING NOW!!");
    console.log(err.message, err.name);
    process.exit(1);
  });

  
const DB = 'mongodb://localhost:27017/examUpload';
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => {
    console.log("DB connected successfully");
  });


  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
    },
  });

  const multerFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
    
  } else {
    cb(new Error("Not a PDF File!!"), false);
  }

};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

app.post('/api/uploadFile', upload.single('myFile'), async (req, res)=>{
  try {
    const newFile = await File.create({
      name: req.file.filename,
    });
    res.status(200).json({
      status: "success",
      message: "File created successfully!!",
    });
  } catch (error) {
    res.json({
      error,
    });
  }  
});

app.get("/api/getFiles", async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json({
      status: "success",
      files,
    });
  } catch (error) {
    res.json({
      status: "Fail",
      error,
    });
  }
});

app.get('/', (req, res)=>{
    res.status(200).render('index')
})

const port = 3000;

app.listen(port, () => {
  console.log("Server is up listening on port:" + port);
});
