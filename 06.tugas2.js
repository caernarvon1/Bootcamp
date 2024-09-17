const fs = require('fs'); // Memuat modul 'fs' untuk membaca dan menulis file
const yargs = require('yargs'); // Menggunakan yargs untuk mengelola input dari command line

// Fungsi untuk membaca data dari file JSON
const readData = () => {
  const data = fs.readFileSync('contacts.json', 'utf-8'); // Membaca file JSON sebagai teks
  return JSON.parse(data); // Mengubah teks JSON menjadi objek JavaScript
};

// Fungsi untuk menulis data ke file JSON
const writeData = (data) => {
  fs.writeFileSync('contacts.json', JSON.stringify(data, null, 2)); // Menyimpan data dalam format JSON ke file dengan format yang rapi
};

// Fungsi untuk menampilkan daftar semua kontak dalam format baris
const listContacts = (dataList) => {
  console.log('Daftar Kontak:');
  dataList.forEach((data, index) => {
    // Mengambil nama, nomor telepon, dan email dari setiap kontak
    const name = data.name || 'Name not available';
    const phone = data.phone || 'Phone not available';
    const email = data.email || 'Email not available';
    // Menampilkan informasi kontak per baris
    console.log(`${index + 1}. Name: ${name}, Phone: ${phone}, Email: ${email}`);
  });
};

// Fungsi untuk menambahkan kontak baru
const addContact = (dataList, name, phone, email) => {
  // Memeriksa apakah kontak dengan nama yang sama sudah ada
  const isDuplicate = dataList.some(data => data.name && data.name.toLowerCase() === name.toLowerCase());

  if (isDuplicate) {
    console.log(`Kontak dengan nama "${name}" sudah ada.`); // Jika nama sudah ada, tampilkan pesan
    return;
  }

  // Membuat objek kontak baru
  const newContact = { name, phone, email };
  dataList.push(newContact); // Menambahkan kontak baru ke daftar

  // Simpan perubahan ke file JSON
  writeData(dataList);
  console.log(`Kontak baru dengan nama "${name}" telah ditambahkan.`);
};

// Fungsi untuk mengedit kontak yang ada
const editContact = (dataList, oldName, newName, newPhone, newEmail) => {
  // Cari indeks kontak berdasarkan nama lama
  const contactIndex = dataList.findIndex(data => data.name && data.name.toLowerCase() === oldName.toLowerCase());

  if (contactIndex === -1) {
    console.log(`Nama "${oldName}" tidak ditemukan.`); // Jika nama lama tidak ditemukan, tampilkan pesan
    return;
  }

  // Mengupdate data kontak yang ditemukan
  if (newName) dataList[contactIndex].name = newName;
  if (newPhone) dataList[contactIndex].phone = newPhone;
  if (newEmail) dataList[contactIndex].email = newEmail;

  // Simpan perubahan ke file JSON
  writeData(dataList);
  console.log(`Kontak dengan nama "${oldName}" telah diperbarui.`);
};

// Fungsi untuk menghapus kontak berdasarkan nama
const deleteContact = (dataList, name) => {
  const updatedList = dataList.filter(contact => contact.name.toLowerCase() !== name.toLowerCase());

  if (updatedList.length === dataList.length) {
    console.log(`Kontak dengan nama "${name}" tidak ditemukan.`);
  } else {
    writeData(updatedList); // Menyimpan data yang telah diperbarui
    console.log(`Kontak dengan nama "${name}" telah dihapus.`);
  }
};

// Mengelola input dari command line
const argv = yargs
  .option('list', {
    alias: 'l',
    type: 'boolean',
    description: 'Tampilkan daftar semua kontak'
  })
  .option('add', {
    alias: 'a',
    type: 'boolean',
    description: 'Tambahkan kontak baru'
  })
  .option('edit', {
    alias: 'e',
    type: 'string',
    description: 'Edit kontak berdasarkan nama lama'
  })
  .option('remove', {
    alias: 'r',
    type: 'string',
    description: 'Hapus kontak berdasarkan nama'
  })
  .option('name', {
    alias: 'n',
    type: 'string',
    description: 'Nama untuk kontak baru atau yang diupdate'
  })
  .option('phone', {
    alias: 'p',
    type: 'string',
    description: 'Nomor telepon untuk kontak baru atau yang diupdate'
  })
  .option('email', {
    alias: 'm',
    type: 'string',
    description: 'Email untuk kontak baru atau yang diupdate'
  })
  .help()
  .argv;

const dataList = readData(); // Membaca data dari file JSON

// Menampilkan daftar kontak saat program dijalankan pertama kali
listContacts(dataList);

// Tambahkan kontak baru jika opsi 'add' diberikan
if (argv.add) {
  const { name, phone, email } = argv;

  if (!name || !phone || !email) {
    console.log('Untuk menambahkan kontak baru, silakan berikan --name, --phone, dan --email.'); // Jika data tidak lengkap, tampilkan pesan
  } else {
    addContact(dataList, name, phone, email); // Menambahkan kontak baru
  }
}

// Edit kontak jika opsi 'edit' diberikan
if (argv.edit) {
  const { edit: oldName, name: newName, phone: newPhone, email: newEmail } = argv;

  if (!newName && !newPhone && !newEmail) {
    console.log('Silakan berikan data baru yang akan diupdate menggunakan --name, --phone, atau --email.'); // Jika tidak ada data baru yang diberikan, tampilkan pesan
  } else {
    editContact(dataList, oldName, newName, newPhone, newEmail); // Edit kontak berdasarkan nama lama
  }
}

// Hapus kontak jika opsi 'remove' diberikan
if (argv.remove) {
  const { remove: nameToRemove } = argv;

  if (!nameToRemove) {
    console.log('Silakan berikan nama kontak yang akan dihapus menggunakan --remove.');
  } else {
    deleteContact(dataList, nameToRemove); // Hapus kontak berdasarkan nama
  }
}
