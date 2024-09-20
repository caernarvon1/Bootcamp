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

// Route for the contact page
app.get("/contact", (req, res) => {
    fs.readFile(path.join(__dirname, "..", "contacts.json"), "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading contact data.");
        }
        let contacts;
        try {
            contacts = JSON.parse(data); // Parsing JSON data
        } catch (parseErr) {
            return res.status(500).send("Error parsing contact data.");
        }
        res.render("contact", { contacts }); // Kirim variabel 'contacts' ke template
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
