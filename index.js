// import files / folder
import express from "express";
import path from "node:path";
import fs from "node:fs";

// create metods
const app = express();
const PORT = 3210;

// set methods
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "public")));

// route
app.get("/", (req, res) => {
  fs.readdir(`files`, (err, files) => {
    res.render("index", { files: files });
  });
});

app.get("/files/:filename", (req, res) => {
  fs.readFile(`/files/${req.params.filename}`, "utf-8", (err, filedata) => {
    if (err) console.error("Error:- ", err);
    else
      res.render("show", {
        filename: req.params.filename,
        filedata: filedata,
      });
  });
});

app.post("/create", (req, res) => {
  fs.writeFile(
    `./files/${req.body.title.split(" ").join("")}.txt`,
    `${req.body.details}`,
    () => {
      res.redirect("/");
    }
  );
});

// create server rendering
app.listen(PORT, () => {
  console.log(`Server Running at http://localhost:${PORT}/`);
});
