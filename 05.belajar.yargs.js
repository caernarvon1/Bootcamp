const fs = require('fs');
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const validator = require('validator'); // Import validator

// Fungsi untuk membaca data dari file JSON
function loadContacts(filePath) {
    try {
        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data); // Parse data JSON dari file
    } catch (error) {
        return []; // Jika file tidak ditemukan atau kosong, return array kosong
    }
}

// Fungsi untuk menyimpan data baru ke file JSON
function saveContact(newData, filePath) {
    let contacts = loadContacts(filePath); // Baca kontak yang sudah ada

    // Cek apakah nama sudah ada dalam data
    const duplicate = contacts.find(contact => contact.name === newData.name);
    if (duplicate) {
        console.log("Nama sudah ada.");
        return;
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

const rl = readline.createInterface({ input, output }); // Membuat interface untuk input/output di terminal

// Pertanyaan pertama: nama pengguna
rl.question("Siapa nama kamu? ", (answer) => {
    // Validasi apakah nama hanya berisi huruf dan tidak kosong
    if (!answer || !validator.isAlpha(answer)) {
        console.log("Nama hanya boleh berisi huruf dan tidak boleh kosong.");
        rl.close(); // Menutup readline jika validasi gagal
        return;
    }

    // Pertanyaan kedua: nomor HP pengguna
    rl.question("Berapa nomor HP kamu? ", (answer1) => {
        // Validasi apakah nomor HP sesuai dengan format Indonesia
        if (!validator.isMobilePhone(answer1, 'id-ID')) {
            console.log("Nomor HP tidak valid.");
            rl.close(); // Menutup readline jika validasi gagal
            return;
        }

        // Pertanyaan ketiga: email pengguna
        rl.question("Apa Email kamu? ", (answer2) => {
            // Validasi apakah email valid
            if (!validator.isEmail(answer2)) {
                console.log("Email tidak valid.");
                rl.close(); // Menutup readline jika validasi gagal
                return;
            }

            // Jika semua input valid, gabungkan data dan simpan ke file JSON
            rl.close(); // Menutup readline setelah selesai
            const newContact = { name: answer, phone: answer1, email: answer2 }; // Objek data baru
            saveContact(newContact, "contacts.json"); // Simpan data ke contacts.json
        });
    });
});
