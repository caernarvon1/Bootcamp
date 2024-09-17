const fs = require('fs'); // Memuat modul 'fs' (file system) untuk membaca file.
const yargs = require('yargs'); // Menggunakan yargs untuk input dari command line

// Fungsi untuk membaca file JSON
const readData = () => {
  const data = fs.readFileSync('contacts.json', 'utf-8'); // Membaca file 'contacts.json' dalam format teks.
  return JSON.parse(data); // Mengubah teks JSON menjadi objek JavaScript.
};

// Fungsi untuk menulis data ke file JSON
const writeData = (data) => {
  fs.writeFileSync('contacts.json', JSON.stringify(data, null, 2)); // Menulis data ke file 'contacts.json' dengan format JSON yang indah.
};

// Ambil nama dari input command line menggunakan yargs
const argv = yargs
  .option('name', {
    alias: 'n',
    type: 'string',
    description: 'Cari detail berdasarkan nama' // Deskripsi untuk opsi 'name'
  })
  .option('list', {
    alias: 'l',
    type: 'boolean',
    description: 'Tampilkan daftar semua kontak' // Deskripsi untuk opsi 'list'
  })
  .option('remove', {
    alias: 'r',
    type: 'string',
    description: 'Hapus kontak berdasarkan nama' // Deskripsi untuk opsi 'remove'
  })
  .help() // Menampilkan bantuan untuk opsi command line
  .argv; // Mengambil argumen yang diberikan dari command line

const dataList = readData(); // Membaca dan menyimpan data dari file JSON sebagai array objek

if (argv.list) {
  // Jika argumen 'list' diberikan, tampilkan semua kontak
  console.log('Daftar Kontak:');
  dataList.forEach(data => {
    const name = data.name || 'Name not available'; // Jika properti 'name' tidak ada, tampilkan teks default
    const phone = data.phone || 'Phone not available'; // Jika properti 'phone' tidak ada, tampilkan teks default
    const email = data.email || 'Email not available'; // Jika properti 'email' tidak ada, tampilkan teks default

    // Menampilkan nama, nomor telepon, dan email dalam satu baris
    console.log(`Name: ${name}, Phone: ${phone}, Email: ${email}`);
  });
} else if (argv.name) {
  // Jika argumen 'name' diberikan, cari detail berdasarkan nama
  const searchName = argv.name.toLowerCase(); // Ubah nama pencarian ke huruf kecil agar pencarian tidak case-sensitive
  const result = dataList.find(data => data.name && data.name.toLowerCase() === searchName); // Mencari data yang sesuai

  if (result) {
    // Jika ditemukan, tampilkan detailnya
    console.log(`Detail ditemukan:`);
    console.log(`Name: ${result.name}`); // Menampilkan nama
    console.log(`Phone: ${result.phone || 'Phone not available'}`); // Menampilkan nomor telepon
    console.log(`Email: ${result.email || 'Email not available'}`); // Menampilkan email
  } else {
    // Jika tidak ditemukan, beri tahu pengguna
    console.log(`Nama "${argv.name}" tidak ditemukan.`); // Pesan jika nama tidak ditemukan
  }
} else if (argv.remove) {
  // Jika argumen 'remove' diberikan, hapus kontak berdasarkan nama
  const removeName = argv.remove.toLowerCase(); // Ubah nama penghapusan ke huruf kecil agar pencarian tidak case-sensitive
  const updatedList = dataList.filter(data => !(data.name && data.name.toLowerCase() === removeName)); // Menghapus kontak yang sesuai

  if (updatedList.length < dataList.length) {
    // Jika kontak berhasil dihapus, simpan perubahan dan beri tahu pengguna
    writeData(updatedList);
    console.log(`Kontak dengan nama "${argv.remove}" telah dihapus.`);
  } else {
    // Jika tidak ada kontak yang dihapus, beri tahu pengguna
    console.log(`Nama "${argv.remove}" tidak ditemukan.`); // Pesan jika nama tidak ditemukan
  }
} else {
  // Jika tidak ada argumen atau argumen tidak sesuai, tampilkan pesan instruksi
  console.log('Silakan gunakan --list untuk menampilkan semua kontak, --name=<nama> untuk mencari kontak berdasarkan nama, atau --remove=<nama> untuk menghapus kontak berdasarkan nama.');
}
