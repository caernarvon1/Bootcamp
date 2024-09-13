const fs = require('fs'); // Modul untuk membaca dan menulis file
const yargs = require('yargs'); // Modul untuk mengambil input dari command line
const validator = require('validator'); // Modul untuk memvalidasi input (seperti email, nomor telepon)

// Fungsi untuk membaca, memeriksa duplikat, dan menyimpan data ke file
function saveContact(newData, filePath) {
    let contacts = [];

    // Coba baca file JSON jika ada
    try {
        const data = fs.readFileSync(filePath, "utf-8");
        contacts = JSON.parse(data); // Ubah data JSON menjadi array
    } catch (error) {
        console.log("File tidak ditemukan atau kosong. Membuat file baru.");
    }

    // Periksa apakah data sudah ada
    const isDuplicate = contacts.some(contact =>
        contact.name === newData.name || contact.phone === newData.phone || contact.email === newData.email
    );

    if (isDuplicate) {
        console.log("Kontak dengan nama, nomor telepon, atau email tersebut sudah ada.");
        return; // Jika ada duplikat, batalkan penyimpanan
    }

    // Tambahkan data baru ke array
    contacts.push(newData);

    // Simpan data kembali ke file JSON
    try {
        fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2)); // Simpan dalam format JSON yang rapi
        console.log("Data berhasil disimpan.");
    } catch (error) {
        console.log("Error saat menulis file:", error);
    }
}

// Mengatur perintah 'add' untuk menambahkan kontak baru dari command line
yargs.command({
    command: 'add',
    describe: 'Menambahkan kontak baru',
    builder: {
        // Opsi untuk nama
        name: {
            describe: 'Nama kontak',
            demandOption: true, // Wajib diisi
            type: 'string' // Harus berupa string
        },
        // Opsi untuk nomor telepon
        phone: {
            describe: 'Nomor HP',
            demandOption: true, // Wajib diisi
            type: 'string' // Harus berupa string
        },
        // Opsi untuk email
        email: {
            describe: 'Email',
            demandOption: true, // Wajib diisi
            type: 'string' // Harus berupa string
        }
    },
    handler(argv) {
        const { name, phone, email } = argv;

        // Validasi nama hanya berisi huruf
        if (!validator.isAlpha(name, 'en-US', { ignore: ' ' })) {
            console.log("Nama hanya boleh berisi huruf dan tidak boleh kosong.");
            return;
        }

        // Validasi nomor HP sesuai format Indonesia
        if (!validator.isMobilePhone(phone, 'id-ID')) {
            console.log("Nomor HP tidak valid.");
            return;
        }

        // Validasi email
        if (!validator.isEmail(email)) {
            console.log("Email tidak valid.");
            return;
        }

        // Jika semua validasi sukses, simpan kontak baru
        const newContact = { name, phone, email };
        saveContact(newContact, "contacts.json"); // Simpan ke file contacts.json
    }
});

yargs.parse(); // Proses input dari command line
