const fs = require('fs'); // Modul untuk membaca dan menulis file
const yargs = require('yargs'); // Modul untuk mengambil input dari command line
const validator = require('validator'); // Modul untuk memvalidasi input (seperti email, nomor telepon)

// Fungsi untuk membaca kontak dari file
function loadContacts(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data); // Mengembalikan array dari file JSON
    } catch (error) {
        return []; // Jika file tidak ada atau kosong, kembalikan array kosong
    }
}

// Fungsi untuk menyimpan kontak baru
function saveContact(newData, filePath) {
    let contacts = loadContacts(filePath); // Baca kontak yang sudah ada

    // Cek apakah kombinasi nama dan nomor HP sudah ada
    const duplicate = contacts.find(contact => 
        contact.name.toLowerCase() === newData.name.toLowerCase() && contact.phone === newData.phone
    );

    if (duplicate) {
        console.log("Data telah tersedia.");
        return;
    }

    // Tambahkan data baru ke array contacts
    contacts.push(newData);

    // Tulis kembali array contacts ke dalam file JSON
    try {
        fs.writeFileSync(filePath, JSON.stringify(contacts, null, 2)); // Simpan dalam format JSON rapi
        console.log("Data berhasil disimpan.");
    } catch (error) {
        console.log("Error saat menulis file:", error);
    }
}

// Mengatur perintah 'add' untuk menambahkan kontak baru melalui command line
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
        // Opsi untuk email (opsional)
        email: {
            describe: 'Email (opsional)',
            demandOption: false, // Tidak wajib diisi
            type: 'string' // Harus berupa string jika diisi
        }
    },
    handler(argv) {
        const { name, phone, email } = argv;

        // Validasi apakah nama hanya berisi huruf
        if (!validator.isAlpha(name, 'en-US', { ignore: ' ' })) {
            console.log("Nama hanya boleh berisi huruf dan tidak boleh kosong.");
            return;
        }

        // Validasi apakah nomor HP sesuai dengan format Indonesia
        if (!validator.isMobilePhone(phone, 'id-ID')) {
            console.log("Nomor HP tidak valid.");
            return;
        }

        // Jika email diisi, maka validasi email
        if (email && !validator.isEmail(email)) {
            console.log("Email tidak valid.");
            return;
        }

        // Jika semua validasi sukses, buat objek kontak baru dan simpan
        const newContact = { 
            name, 
            phone, 
            email: email || "tidak tersedia" // Jika email tidak diisi, set ke "tidak tersedia"
        };

        saveContact(newContact, "contacts.json"); // Simpan ke file contacts.json
    }
});

yargs.parse(); // Memproses input dari command line
