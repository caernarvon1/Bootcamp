const fs = require('fs');
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const validator = require('validator'); // Import validator

const rl = readline.createInterface({ input, output });

// Fungsi untuk menambahkan data ke file dengan validasi input
function addDataToFile(filename) {
    rl.question("Siapa nama kamu? ", (name) => {
        if (!name || !validator.isAlpha(name)) {
            console.log("Nama hanya boleh berisi huruf dan tidak boleh kosong.");
            rl.close();
            return;
        }

        rl.question("Berapa nomor HP kamu? ", (phone) => {
            if (!validator.isMobilePhone(phone, 'id-ID')) {
                console.log("Nomor HP tidak valid.");
                rl.close();
                return;
            }

            rl.question("Apa Email kamu? ", (email) => {
                if (!validator.isEmail(email)) {
                    console.log("Email tidak valid.");
                    rl.close();
                    return;
                }

                // Menutup antarmuka readline
                rl.close();

                // Membaca data lama dari file
                let contacts = [];
                try {
                    if (fs.existsSync(filename)) {
                        const file = fs.readFileSync(filename, 'utf-8');
                        contacts = JSON.parse(file);
                    }
                } catch (err) {
                    console.log(`Error saat membaca file ${filename}:`, err);
                }

                // Menambahkan data baru
                const newData = { name, phone, email };
                contacts.push(newData);

                // Menyimpan data gabungan ke file
                // buat lagi ke ChatGPT untuk function menyimpan data 
                try {
                    fs.writeFileSync(filename, JSON.stringify(contacts, null, 2));
                    console.log(`Data berhasil disimpan di ${filename}`);
                } catch (err) {
                    console.log(`Error saat menyimpan data ke ${filename}:`, err);
                }
            });
        });
    });
}

// Panggil fungsi untuk menambahkan data ke file
addDataToFile('contacts.json');
