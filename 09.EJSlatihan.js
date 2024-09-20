const express = require("express");
const path = require("path");
const fs = require("fs"); // Memanggil modul fs untuk membaca file
const app = express();
const port = 3000;

app.set("view engine", "ejs");

// Mengirim file index.html ketika route '/' diakses
app.get("/", (req, res) => {
    const nama = "Asep";
    const title = "Homepage"; 
    res.render("index", { nama, title });
});

// Mengirim file about.html ketika route '/about' diakses
app.get("/about", (req, res) => {
    res.render("about", { title: "About Us" });
});

app.get("/contact", (req, res) => {
    fs.readFile(path.join(__dirname, "contacts.json"), "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading contact data.");
        }
        const contacts = JSON.parse(data);
        res.render("contact", { contacts });
    });
});


// Middleware untuk menangani rute yang tidak ada (404)
app.use((req, res) => {
    res.status(404).send("Page not found : 404");
});

// Menjalankan server pada port yang sudah ditetapkan
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
