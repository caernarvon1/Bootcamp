const express = require("express"); // Mengimpor modul Express
const path = require("path"); // Mengimpor modul Path untuk menangani dan memanipulasi jalur file
const fs = require("fs"); // Mengimpor modul fs untuk membaca file
const app = express(); // Membuat instance aplikasi Express
const port = 3000; // Menentukan port yang akan digunakan oleh server

app.set("view engine", "ejs"); // Mengatur template engine menjadi EJS untuk rendering halaman

// Mengirim file index.ejs ketika route '/' atau '/index' diakses
app.get(["/", "/index"], (req, res) => {
    res.render("index"); // Render file 'index.ejs' yang terletak di folder views
});

// Mengirim file about.ejs ketika route '/about' diakses
app.get("/about", (req, res) => {
    res.render("about", { title: "About Us" }); // Render file 'about.ejs' dan mengirim variabel title
});

// Mengirim file contact.ejs ketika route '/contact' diakses
app.get("/contact", (req, res) => {
    // Membaca file contacts.json untuk mendapatkan data kontak
    fs.readFile(path.join(__dirname, "contacts.json"), "utf8", (err, data) => {
        if (err) {
            // Jika ada error saat membaca file, kirim pesan error 500
            return res.status(500).send("Error reading contact data.");
        }
        const contacts = JSON.parse(data); // Mengubah data JSON menjadi objek JavaScript
        res.render("contact", { contacts }); // Render file 'contact.ejs' dan mengirim data kontak ke template
    });
});

// Middleware untuk menangani rute yang tidak ada (404)
app.use((req, res) => {
    res.status(404).send("Page not found : 404"); // Kirim pesan 404 jika rute tidak ditemukan
});

// Menjalankan server pada port yang sudah ditetapkan
app.listen(port, () => {
    console.log(`App listening on port ${port}`); // Pesan konsol saat server berjalan
});
