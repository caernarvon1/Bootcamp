const express = require("express");
const path = require("path"); // Modul untuk menangani path file
const app = express(); // Membuat instance aplikasi Express
const port = 3000; // Menetapkan port di mana server akan berjalan

// Route untuk halaman utama ('/') yang mengirimkan file index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "Web Server", "index.html")); // Mengirim file index.html dari folder 'public'
});

// Route untuk halaman '/about' yang mengirimkan file about.html
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "Web Server", "about.html")); // Mengirim file about.html dari folder 'public'
});

// Route untuk halaman '/contact' yang mengirimkan file contact.html
app.get("/contact", (req, res) => {
    res.sendFile(path.join(__dirname, "Web Server", "contact.html")); // Mengirim file contact.html dari folder 'public'
});


app.get("/product/:proID/category/:catID",(req, res) => {
    res.send(
        `product ID : ${req.params.prodID} <br>category ID : ${req.params.catID}`

    );
});


// Middleware untuk menangani rute yang tidak ada, mengirimkan pesan 404 jika halaman tidak ditemukan
app.use((req, res) => {
    res.status(404); // Mengatur status respons menjadi 404 (Not Found)
    res.send("Page not found : 404"); // Mengirim pesan error 404 ke client
});

// Menjalankan server dan mendengarkan pada port yang sudah ditetapkan
app.listen(port, () => {
    console.log(`App listening on port ${port}`); // Menampilkan pesan di konsol ketika server aktif
});
