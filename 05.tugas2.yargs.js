const fs = require('fs');
const yargs = require('yargs');
const validator = require('validator'); // Import validator

// Fungsi gabungan untuk membaca, menggabungkan, dan menulis data
function saveContact(newData, filePath) {
    let contacts = [];
    
    // Coba baca file jika ada, jika tidak, buat array baru kosong
    try {
        const data = fs.readFileSync(filePath, "utf-8");
        contacts = JSON.parse(data); // Parse data JSON dari file
    } catch (error) {
        console.log("File tidak ditemukan atau kosong. Membuat file baru.");
    }

    // Tambahkan data baru ke array contacts yang sudah ada
    contacts.push(newData);

    // Tulis kembali ke file JSON dengan data yang sudah diperbarui
    try {
        fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2)); // null, 2 untuk membuat format JSON rapi
        console.log("Data berhasil disimpan.");
    } catch (error) {
        console.log("Error saat menulis file:", error);
    }
}

// Konfigurasi yargs untuk mengambil input dari command line
yargs.command({
    command: 'add',
    describe: 'Menambahkan kontak baru',
    builder: {
        name: {
            describe: 'Nama kontak',
            demandOption: true,
            type: 'string'
        },
        phone: {
            describe: 'Nomor HP',
            demandOption: true,
            type: 'string'
        },
        email: {
            describe: 'Email',
            demandOption: true,
            type: 'string'
        }
    },
    handler(argv) {
        const { name, phone, email } = argv;

        // Validasi nama
        if (!validator.isAlpha(name, 'en-US', { ignore: ' ' })) {
            console.log("Nama hanya boleh berisi huruf dan tidak boleh kosong.");
            return;
        }

        // Validasi nomor HP
        if (!validator.isMobilePhone(phone, 'id-ID')) {
            console.log("Nomor HP tidak valid.");
            return;
        }

        // Validasi email
        if (!validator.isEmail(email)) {
            console.log("Email tidak valid.");
            return;
        }

        // Jika semua input valid, gabungkan data dan simpan ke file JSON
        const newContact = { name, phone, email };
        saveContact(newContact, "contacts.json");
    }
});

yargs.parse(); // Memproses input dari command line
