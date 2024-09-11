const fs = require('fs');
const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const validator = require('validator'); // Import validator

const rl = readline.createInterface({ input, output });

rl.question("Siapa nama kamu? ", (answer) => {
    if (!answer || !validator.isAlpha(answer )) {
        console.log("Nama hanya boleh berisi huruf dan tidak boleh kosong.");
        rl.close();
        return;
    }

    rl.question("Berapa nomor HP kamu? ", (answer1) => {
        // console.log(validator.isMobilePhone(answer1,'id-ID'));
        
        if (!validator.isMobilePhone(answer1, 'id-ID')) { // Validasi nomor telepon untuk format Indonesia
            console.log("Nomor HP tidak valid.");
            rl.close();
            return;
        }

        rl.question("Apa Email kamu? ", (answer2) => {
            if (!validator.isEmail(answer2)) { // Validasi email
                console.log("Email tidak valid.");
                rl.close();
                return;
            }

            // Jika semua input valid, simpan data ke dalam file
            rl.close();
           const result = {answer, answer1, answer2};
           const file = fs.readFileSync("contacts.json", "utf-8"); 
           const contacts = JSON.parse(file);
           contacts.push(result);

            fs.writeFileSync("contacts.json", JSON.stringify(contacts));
            console.log("Data berhasil disimpan di test.txt");
        });
    });
});