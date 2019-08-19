const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");

const checkFileType = (file, cb) => {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // check the ext
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mimetype
  const mimetype = fileTypes.test(file.mimetype);

  if (mimetype && extName) {
    return cb(null, true);
  } else {
    cb("Error: Images only!");
  }
};

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/upload/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.split(".")[0];

    cb(null, fileName + "-" + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage,
  limits: {
    fileSize: 1000000
  },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single("myImage");

const app = express();
const PORT = 3000;

// EJS
app.set("view engine", "ejs");

// Static file
app.use(express.static("./public"));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/upload", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("index", {
        msg: err
      });
    } else {
      if (req.file === undefined) {
        res.render("index", {
          msg: "Error: No file selected"
        });
      } else {
        res.render("index", {
          msg: "File uploaded",
          file: `upload/${req.file.filename}`
        });
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
