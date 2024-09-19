const express = require("express"); // Memanggil modul Express untuk membuat server
const path = require("path"); // Modul untuk menangani path file
const app = express(); // Membuat instance aplikasi Express
const port = 3000; // Menetapkan port di mana server akan berjalan

// Mengirim file index.html ketika route '/' diakses
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html")); // Kirim file index.html dari folder 'public'
});

// Mengirim file about.html ketika route '/about' diakses
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "about.html")); // Kirim file about.html dari folder 'public'
});

// Mengirim file contact.html ketika route '/contact' diakses
app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "contact.html")); // Kirim file contact.html dari folder 'public'
});

// Middleware untuk menangani rute yang tidak ada (404)
app.use((req, res) => {
    res.status(404).send("Page not found : 404"); // Kirim pesan error 404 jika halaman tidak ditemukan
});

// Menjalankan server pada port yang sudah ditetapkan
app.listen(port, () => {
    console.log(`App listening on port ${port}`); // Menampilkan pesan di konsol ketika server aktif
});
