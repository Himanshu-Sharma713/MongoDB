// Import necessary modules
import express from "express";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

// Resolve __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = 3210;

// Set methods
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Ensure 'files' directory exists
const filesDir = path.join(__dirname, "files");
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir, { recursive: true });
}

// Home route to display all files
app.get("/", (req, res) => {
  fs.readdir(filesDir, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).send("Error reading files");
    }
    res.render("index", { files: files });
  });
});

// Update file name
app.get("/edit/:filename", (req, res) => {
  res.render("edit", { filename: req.params.filename });
});

app.post("/edit", (req, res) => {
  fs.rename(
    `./files/${req.body.previous}`,
    `./files/${req.body.new}`,
    (err) => {
      res.redirect("/");
    }
  );
});

// Route to read a file
app.get("/files/:filename", (req, res) => {
  const filePath = path.join(filesDir, req.params.filename);

  fs.readFile(filePath, "utf-8", (err, filedata) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(404).send("File not found");
    }
    res.render("show", {
      filename: req.params.filename,
      filedata: filedata,
    });
  });
});

// Route to create a new file
app.post("/create", (req, res) => {
  const fileName = req.body.title.split(" ").join("") + ".txt";
  const filePath = path.join(filesDir, fileName);

  fs.writeFile(filePath, req.body.details, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).send("Error creating file");
    }
    res.redirect("/");
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server Running at http://localhost:${PORT}/`);
});
