const express = require("express"); // Mengimpor modul Express
const path = require("path"); // Mengimpor modul Path untuk menangani dan memanipulasi jalur file
const fs = require("fs"); // Mengimpor modul fs untuk membaca file
const expressLayouts = require("express-ejs-layouts"); // Mengimpor express-ejs-layouts
const validator = require("validator"); // Mengimpor validator untuk validasi input

const app = express(); // Membuat instance aplikasi Express
const port = 3000; // Menentukan port yang akan digunakan oleh server

app.set("view engine", "ejs"); // Mengatur template engine menjadi EJS untuk rendering halaman
app.set("views", path.join(__dirname, "views")); // Mengatur direktori views

// Menggunakan express-ejs-layouts untuk layout global
app.use(expressLayouts);
app.set("layout", "layout/main"); // Mengatur layout default ke main.ejs

// Menggunakan middleware 'express.static' untuk menyajikan file statis dari folder 'images'
app.use(express.static('images'));

// Middleware untuk mengurai body dari request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware yang akan dijalankan pada setiap request
app.use((req, res, next) => {
    console.log('Time:', Date.now()); // Cetak waktu saat request diterima
    next(); // Lanjutkan ke middleware atau route berikutnya
});

// Mengirim file index.ejs ketika route '/' atau '/index' diakses
app.get(["/", "/index"], (req, res) => {
    res.render("index", { title: "Home" }); // Render file 'index.ejs' dan menyertakan title
});

// Mengirim file about.ejs ketika route '/about' diakses
app.get("/about", (req, res) => {
    res.render("about", { title: "About Us" }); // Render file 'about.ejs' dan menyertakan title
});

// Mengirim file contact.ejs ketika route '/contact' diakses
app.get("/contact", (req, res) => {
    // Membaca file contacts.json untuk mendapatkan data kontak
    fs.readFile(path.join(__dirname, "contacts.json"), "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Error reading contact data."); // Jika ada error saat membaca file
        }
        const contacts = JSON.parse(data); // Mengubah data JSON menjadi objek JavaScript
        res.render("contact", { contacts, title: "Contact" }); // Render file 'contact.ejs' dan menyertakan data kontak serta title
    });
});

// Route untuk menambahkan kontak baru
app.post('/add-contact', (req, res) => {
    const newContact = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email || null // Email bisa jadi kosong
    };

    // Validasi nama, phone, dan email
    const errors = [];

    if (!validator.isAlpha(newContact.name.replace(/ /g, ''))) { // Memastikan nama hanya mengandung huruf
        errors.push("Name must contain only letters.");
    }
    if (!validator.isMobilePhone(newContact.phone, 'any')) {
        errors.push("Phone number is not valid.");
    }
    if (newContact.email && !validator.isEmail(newContact.email)) {
        errors.push("Email is not valid.");
    }

    if (errors.length > 0) {
        return res.status(400).send(errors.join(" ")); // Mengembalikan error jika ada
    }

    // Membaca file contacts.json untuk menambahkan kontak baru
    fs.readFile(path.join(__dirname, 'contacts.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading contacts'); // Jika ada error saat membaca file
        }

        const contacts = JSON.parse(data);
        contacts.push(newContact); // Menambahkan kontak baru ke dalam array

        fs.writeFile(path.join(__dirname, 'contacts.json'), JSON.stringify(contacts, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error saving contact'); // Jika ada error saat menyimpan file
            }
            res.redirect('/contact'); // Kembali ke halaman kontak setelah menambahkan
        });
    });
});

// Route untuk menghapus kontak
app.post('/delete-contact', (req, res) => {
    const index = req.body.index; // Ambil indeks dari body request

    if (index === undefined) {
        return res.status(400).send('Index is required'); // Pastikan index ada
    }

    fs.readFile(path.join(__dirname, 'contacts.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading contacts'); // Jika ada error saat membaca file
        }

        const contacts = JSON.parse(data);
        contacts.splice(index, 1); // Hapus kontak berdasarkan indeks

        fs.writeFile(path.join(__dirname, 'contacts.json'), JSON.stringify(contacts, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error saving contact'); // Jika ada error saat menyimpan file
            }
            res.redirect('/contact'); // Kembali ke halaman kontak setelah menghapus
        });
    });
});

// Route untuk memperbarui kontak
app.post('/update-contact', (req, res) => {
    const index = req.body.index; // Ambil indeks dari body request
    const updatedContact = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email || null // Email bisa jadi kosong
    };

    // Validasi nama, phone, dan email
    const errors = [];

    if (!validator.isAlpha(updatedContact.name.replace(/ /g, ''))) { // Memastikan nama hanya mengandung huruf
        errors.push("Name must contain only letters.");
    }
    if (!validator.isMobilePhone(updatedContact.phone, 'any')) {
        errors.push("Phone number is not valid.");
    }
    if (updatedContact.email && !validator.isEmail(updatedContact.email)) {
        errors.push("Email is not valid.");
    }

    if (errors.length > 0) {
        return res.status(400).send(errors.join(" ")); // Mengembalikan error jika ada
    }

    fs.readFile(path.join(__dirname, 'contacts.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading contacts'); // Jika ada error saat membaca file
        }

        const contacts = JSON.parse(data);
        if (contacts[index]) {
            contacts[index] = updatedContact; // Memperbarui kontak pada indeks yang diberikan
        }

        fs.writeFile(path.join(__dirname, 'contacts.json'), JSON.stringify(contacts, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error saving contact'); // Jika ada error saat menyimpan file
            }
            res.redirect('/contact'); // Kembali ke halaman kontak setelah memperbarui
        });
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
