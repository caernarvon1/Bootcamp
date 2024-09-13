// Mengimpor modul yang diperlukan
const fs = require('fs'); // Modul untuk operasi file
const yargs = require('yargs'); // Modul untuk menangani argumen command line
const validator = require('validator'); // Modul untuk validasi data

// Fungsi untuk menyimpan data kontak ke file
function saveContact(newData, filePath) {
    let contacts = [];
    
    // Mencoba membaca file jika ada
    try {
        const data = fs.readFileSync(filePath, "utf-8"); // Baca isi file
        contacts = JSON.parse(data); // Mengubah isi file JSON menjadi objek JavaScript
    } catch (error) {
        console.log("File tidak ditemukan atau kosong. Membuat file baru."); // Jika file tidak ada, beri pesan
    }

    // Memeriksa apakah nama, nomor telepon, atau email sudah ada dalam data
    const isDuplicate = contacts.some(contact => 
        contact.name === newData.name || 
        contact.phone === newData.phone || 
        contact.email === newData.email
    );

    if (isDuplicate) {
        console.log("Kontak dengan nama, nomor telepon, atau email tersebut sudah ada."); // Pesan jika ada duplikasi
        return; // Keluar dari fungsi
    }

    // Menambahkan data baru ke dalam array kontak
    contacts.push(newData);

    // Menyimpan kembali data ke file JSON
    try {
        fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2)); // Menulis data ke file dengan format yang rapi
        console.log("Data berhasil disimpan."); // Beri pesan jika berhasil
    } catch (error) {
        console.log("Error saat menulis file:", error); // Beri pesan jika ada kesalahan saat menulis file
    }
}

// Mengatur yargs untuk menangani command line arguments
const argv = yargs
    .command('add', 'Menambahkan kontak baru', {
        name: {
            description: 'Nama kontak', // Deskripsi untuk nama
            alias: 'n', // Alias untuk nama
            type: 'string', // Tipe data adalah string
            demandOption: true // Nama harus ada
        },
        phone: {
            description: 'Nomor HP kontak', // Deskripsi untuk nomor HP
            alias: 'p', // Alias untuk nomor HP
            type: 'string', // Tipe data adalah string
            demandOption: true // Nomor HP harus ada
        },
        email: {
            description: 'Email kontak', // Deskripsi untuk email
            alias: 'e', // Alias untuk email
            type: 'string' // Tipe data adalah string
        }
    })
    .help() // Menyediakan bantuan
    .alias('help', 'h') // Alias untuk bantuan
    .argv; // Mengambil argumen

// Validasi dan pemrosesan input jika perintah 'add' digunakan
if (argv._.includes('add')) {
    const { name, phone, email } = argv; // Mendapatkan nilai dari argumen

    // Validasi nama
    if (!validator.isAlpha(name, 'en-US', {ignore: ' '})) { 
        console.log("Nama hanya boleh berisi huruf dan tidak boleh kosong."); // Pesan jika nama tidak valid
        process.exit(1); // Keluar dari proses dengan status gagal
    }

    // Validasi nomor HP
    if (!validator.isMobilePhone(phone, 'id-ID')) {
        console.log("Nomor HP tidak valid."); // Pesan jika nomor HP tidak valid
        process.exit(1); // Keluar dari proses dengan status gagal
    }

    // Validasi email, jika tidak ada, set menjadi "email tidak ada"
    const validEmail = email && validator.isEmail(email) ? email : "email tidak ada";

    // Membuat objek kontak baru
    const newContact = { name, phone, email: validEmail };

    // Menyimpan kontak baru ke file
    saveContact(newContact, "contacts.json");
}
