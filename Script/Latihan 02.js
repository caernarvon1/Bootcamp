// fs digunakan untuk berinteraksi dengan sistem file.
// readline digunakan untuk membaca input dari pengguna melalui terminal.
// stdin dan stdout adalah aliran data standar untuk input dan output.

const fs=require('fs')
const readline = require("node:readline");
const { stdin: input, stdout: output } =require("node:process");


//readline.createInterface({ input, output }) membuat antarmuka readline yang akan digunakan untuk berinteraksi dengan pengguna.
// rl.question digunakan untuk menanyakan pertanyaan kepada pengguna dan menerima jawabannya.
// Setiap panggilan rl.question menerima dua argumen: teks pertanyaan dan callback fungsi yang menerima jawaban pengguna.
const rl = readline.createInterface({ input, output });

rl.question("Siapa nama kamu?", (answer) => {
    console.log(`nama kamu adalah ${answer}`);

rl.question("Berapa nomor HP kamu?", (answer1) => {
    console.log(`nomor HP kamu adalah ${answer1}`);

rl.question("Apa Email kamu?", (answer2) => {
    console.log(`Email kamu adalah ${answer2}`);

// Setelah semua pertanyaan dijawab dan rl.close() dipanggil, fs.writeFileSync digunakan untuk menulis data ke file test.txt.
// Format data yang ditulis adalah string yang menggabungkan jawaban dari setiap pertanyaan.
// Menutup interface readline
    rl.close();
    fs.writeFileSync('test.txt',`nama kamua adalah ${answer},nomor telp kamu adalah ${answer1}, email kamu adalah ${answer2}`) 
});
    });
        });



        