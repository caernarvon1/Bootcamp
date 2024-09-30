const express = require("express"); // Mengimpor modul Express
const path = require("path"); // Mengimpor modul Path untuk menangani dan memanipulasi jalur file
const expressLayouts = require("express-ejs-layouts"); // Mengimpor express-ejs-layouts
const validator = require("validator"); // Mengimpor validator untuk validasi input

const app = express(); // Membuat instance aplikasi Express
const port = 3000; // Menentukan port yang akan digunakan oleh server

const pool = require("./db.js");

app.set("view engine", "ejs"); // Mengatur template engine menjadi EJS untuk rendering halaman
app.set("views", path.join(__dirname, "views")); // Mengatur direktori views

// Menggunakan express-ejs-layouts untuk layout global
app.use(expressLayouts);
app.set("layout", "layout/main"); // Mengatur layout default ke main.ejs

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
app.get("/contact", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contacts'); // Mengambil data kontak dari database
        const contacts = result.rows; // Mengambil hasil query
        res.render("contact", { contacts, title: "Contact" }); // Render file 'contact.ejs' dan menyertakan data kontak serta title
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error retrieving contacts."); // Mengembalikan error jika ada
    }
});

// Route untuk menambahkan kontak baru
app.post('/add-contact', async (req, res) => {
    const newContact = {
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email || null // Email bisa jadi kosong
    };

    // Validasi nama, phone, dan email
    const errors = [];

    if (!validator.isAlpha(newContact.name.replace(/ /g, ''))) {
        errors.push("Name must contain only letters.");
    }
    if (!validator.isMobilePhone(newContact.phone, 'any')) {
        errors.push("Phone number is not valid.");
    }
    if (newContact.email && !validator.isEmail(newContact.email)) {
        errors.push("Email is not valid.");
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: errors.join(" ") });
    }

    try {
        // Cek apakah phone sudah ada dalam database
        const result = await pool.query(
            `SELECT * FROM contacts WHERE phone = $1`,
            [newContact.phone]
        );
        
        if (result.rows.length > 0) {
            return res.status(400).json({ message: "Phone number already exists." });
        }

        // Jika tidak ada duplikasi, tambahkan kontak baru
        const insertResult = await pool.query(
            `INSERT INTO contacts (name, phone, email) VALUES ($1, $2, $3) RETURNING *`,
            [newContact.name, newContact.phone, newContact.email]
        );
        const addedContact = insertResult.rows[0];
        res.status(201).json(addedContact);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Error adding contact." });
    }
});

// Route untuk menghapus kontak
app.post('/delete-contact', async (req, res) => {
    const { name, phone } = req.body; // Ambil name dan phone dari body request

    if (!name || !phone) {
        return res.status(400).send('Name and phone are required'); // Pastikan name dan phone ada
    }

    try {
        await pool.query(`DELETE FROM contacts WHERE name = $1 AND phone = $2`, [name, phone]); // Hapus kontak berdasarkan name dan phone
        res.redirect('/contact'); // Kembali ke halaman kontak setelah menghapus
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error deleting contact."); // Mengembalikan error jika ada
    }
});

// Route untuk memperbarui kontak
app.post('/update-contact', async (req, res) => {
    const { name, phone, newName, newPhone, newEmail } = req.body; // Ambil name dan phone dari body request

    if (!name || !phone) {
        return res.status(400).send('Name and phone are required'); // Pastikan name dan phone ada
    }

    const updatedContact = {
        name: newName || name,
        phone: newPhone || phone,
        email: newEmail || null // Email bisa jadi kosong
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

    try {
        await pool.query(
            `UPDATE contacts SET name = $1, phone = $2, email = $3 WHERE name = $4 AND phone = $5`,
            [updatedContact.name, updatedContact.phone, updatedContact.email, name, phone]
        );
        res.redirect('/contact'); // Kembali ke halaman kontak setelah memperbarui
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Error updating contact."); // Mengembalikan error jika ada
    }
});

// Middleware untuk menangani rute yang tidak ada (404)
app.use((req, res) => {
    res.status(404).send("Page not found : 404"); // Kirim pesan 404 jika rute tidak ditemukan
});

// Menjalankan server pada port yang sudah ditetapkan
app.listen(port, () => {
    console.log(`App listening on port ${port}`); // Pesan konsol saat server berjalan
});
