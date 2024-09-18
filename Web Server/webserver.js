const http = require("http");

// Fungsi untuk menulis respons HTML
// Fungsi ini mengirimkan respons HTML dengan status kode, judul, dan pesan yang ditentukan
function writeHtmlResponse(res, statusCode, title, message) {
  res.writeHead(statusCode, {
    "Content-Type": "text/html", // Menentukan tipe konten sebagai HTML
  });
  res.write(`<h1>${title}</h1>`); // Menulis elemen heading dengan judul yang diberikan
  res.write(`<p>${message}</p>`); // Menulis paragraf dengan pesan yang diberikan
  res.end(); // Mengakhiri respons
}

// Membuat server HTTP
http
  .createServer((req, res) => { // Menangani setiap permintaan yang masuk
    const url = req.url; // Mengambil URL dari permintaan

    // Mengecek URL dan menentukan respons yang sesuai
    if (url === "/about") {
      // Jika URL adalah "/about", kirimkan halaman about
      writeHtmlResponse(res, 200, "Ini adalah halaman about", "Maaf, saat ini halaman about sedang dalam perbaikan");
    } else if (url === "/contact") {
      // Jika URL adalah "/contact", kirimkan halaman kontak
      writeHtmlResponse(res, 200, "Ini adalah halaman kontak", "Maaf, saat ini halaman kontak sedang dalam perbaikan");
    } else if (url === "/" || url === "/index") {
      // Jika URL adalah "/" atau "/index", kirimkan halaman beranda
      writeHtmlResponse(res, 200, "Haloo, Selamat Datang", "Maaf, saat ini halaman beranda sedang dalam perbaikan");
    } else {
      // Jika URL tidak cocok dengan rute yang ada, kirimkan halaman 404
      writeHtmlResponse(res, 404, "404 - Page not found", "");
    }
  })
  .listen(3000, () => { // Menjalankan server di port 3000
    console.log("Server is listening on port 3000"); // Menampilkan pesan bahwa server sedang berjalan
  });
