const express = require('express');
const axios = require('axios');  // Import axios
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const global = {
  apikeyAtlantic: 'MDlxwzA4M6SCRU6StAUO0oskykfxOjHSeheeoHUpOkEAhlhr52aRdptTGt7V2jzWGseeAGoLPmwFAL1AU4Jw64BnVx8vnRnmFRG9',
  domain: 'https://www.my-panel.im-rerezz.xyz',
  apikey: 'ptla_2hatAKoD8ioKt3VtdiIzvyH5D3eX8Dden5lAOwLQ7G4',
  buypanel1: 1000,
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/buypanel', async (req, res) => {
  const { username, phone } = req.body;
  console.log(`Received data: username=${username}, phone=${phone}`);

  if (!username || !phone) {
    return res.send('• *Example :* /buypanel RezzDev 6285691304150');
  }

  try {
    const nominall = global.buypanel1;
    if (isNaN(nominall) || nominall <= 0) {
      return res.send('Nominal pembayaran tidak valid. Harap periksa konfigurasi.');
    }

    const cekhar = new URLSearchParams();
    cekhar.append("api_key", global.apikeyAtlantic);
    cekhar.append("reff_id", `RezzDev${getRandomInt(100, 900)}`);
    cekhar.append("nominal", nominall.toString());
    cekhar.append("type", "ewallet");
    cekhar.append("metode", "qrisfast");

    // Menggunakan axios untuk request
    const response = await axios.post("https://atlantich2h.com/deposit/create", cekhar);
    const result = response.data;
    console.log(result);  // Debugging response dari API

    if (!result.status) {
      return res.send(`Terjadi kesalahan: ${result.message}`);
    }

    const nominalResult = result.data.nominal;
    const qrPath = path.join(__dirname, 'public', 'qris.jpg');
    await QRCode.toFile(qrPath, result.data.qr_string, { margin: 2, scale: 10 });

    const data = {
      result: result.status,
      data: {
        iddepo: result.data.id,
        qr: qrPath,
        qr_string: result.data.qr_string,
        nominal: nominalResult,
        exp: result.data.expired_at,
      },
    };

    res.render('payment', {
      qr: data.data.qr,
      nominal: nominalResult,
      expired_at: result.data.expired_at,
      iddepo: result.data.id,
    });

    const intervalId = setInterval(async () => {
      const statusParams = new URLSearchParams();
      statusParams.append("api_key", global.apikeyAtlantic);
      statusParams.append("id", data.data.iddepo);

      try {
        const statusResponse = await axios.post("https://atlantich2h.com/deposit/status", statusParams);
        const statusResult = statusResponse.data;
        if (statusResult.data.status === "success") {
          clearInterval(intervalId);
          const randomPassword = String(Math.floor(1000000 + Math.random() * 9000000));

          const userResponse = await axios.post(`${global.domain}/api/application/users`, {
            email: `${username}@RezzDevajahh`,
            username: username,
            first_name: username,
            last_name: username,
            language: "en",
            password: randomPassword,
          }, {
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": `Bearer ${global.apikey}`,
            },
          });

          const userData = userResponse.data;
          if (!userResponse.status === 200) {
            return res.send(`Gagal membuat user di panel: ${userData.errors?.[0]?.detail || "Unknown error"}`);
          }

          const userId = userData.attributes.id;

          res.send(`Panel berhasil dibuat untuk pengguna ${username}.`);
        }
      } catch (error) {
        console.error("Error checking deposit status:", error);
        clearInterval(intervalId);
        res.send("Gagal memvalidasi pembayaran. Silakan coba lagi.");
      }
    }, 5000);

  } catch (error) {
    console.error("Error:", error);
    return res.send(`Terjadi kesalahan: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
