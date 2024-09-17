const fs = require('fs'); // Memuat modul 'fs' (file system) untuk membaca file.
const yargs = require('yargs'); // Menggunakan yargs untuk input dari command line

// Fungsi untuk membaca file JSON
const readData = () => {
  const data = fs.readFileSync('contacts.json', 'utf-8'); // Membaca file 'contacts.json' dalam format teks.
  return JSON.parse(data); // Mengubah teks JSON menjadi objek JavaScript.
};

// Fungsi untuk menulis data ke file JSON
const writeData = (data) => {
  fs.writeFileSync('contacts.json', JSON.stringify(data, null, 2)); // Menulis data ke file 'contacts.json' dengan format JSON yang rapi.
};

// Fungsi untuk menampilkan daftar semua kontak dalam format baris
const listContacts = (dataList) => {
  console.log('Daftar Kontak:');
  dataList.forEach((data, index) => {
    const name = data.name || 'Name not available';
    const phone = data.phone || 'Phone not available';
    const email = data.email || 'Email not available';
    console.log(`${index + 1}. Name: ${name}, Phone: ${phone}, Email: ${email}`);
  });
};

// Fungsi untuk menambahkan kontak baru
const addContact = (dataList, name, phone, email) => {
  // Validasi jika kontak dengan nama yang sama sudah ada
  const isDuplicate = dataList.some(data => data.name && data.name.toLowerCase() === name.toLowerCase());

  if (isDuplicate) {
    console.log(`Kontak dengan nama "${name}" sudah ada.`);
    return;
  }

  // Tambahkan kontak baru
  const newContact = { name, phone, email };
  dataList.push(newContact);

  // Simpan ke file JSON
  writeData(dataList);
  console.log(`Kontak baru dengan nama "${name}" telah ditambahkan.`);
};

// Fungsi untuk mengedit kontak
const editContact = (dataList, oldName, newName, newPhone, newEmail) => {
  const contactIndex = dataList.findIndex(data => data.name && data.name.toLowerCase() === oldName.toLowerCase());

  if (contactIndex === -1) {
    console.log(`Nama "${oldName}" tidak ditemukan.`);
    return;
  }

  // Update detail kontak yang ditemukan
  if (newName) dataList[contactIndex].name = newName;
  if (newPhone) dataList[contactIndex].phone = newPhone;
  if (newEmail) dataList[contactIndex].email = newEmail;

  // Simpan perubahan
  writeData(dataList);
  console.log(`Kontak dengan nama "${oldName}" telah diperbarui.`);
};

// Ambil nama dari input command line menggunakan yargs
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

const dataList = readData(); // Membaca dan menyimpan data dari file JSON sebagai array objek

// Menampilkan daftar kontak pertama kali
listContacts(dataList);

// Menambahkan kontak baru jika opsi 'add' diberikan
if (argv.add) {
  const { name, phone, email } = argv;

  if (!name || !phone || !email) {
    console.log('Untuk menambahkan kontak baru, silakan berikan --name, --phone, dan --email.');
  } else {
    addContact(dataList, name, phone, email); // Menambahkan kontak baru
  }
}

// Mengedit kontak jika opsi 'edit' diberikan
if (argv.edit) {
  const { edit: oldName, name: newName, phone: newPhone, email: newEmail } = argv;

  if (!newName && !newPhone && !newEmail) {
    console.log('Silakan berikan data baru yang akan diupdate menggunakan --name, --phone, atau --email.');
  } else {
    editContact(dataList, oldName, newName, newPhone, newEmail); // Edit kontak berdasarkan oldName
  }
}
