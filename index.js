const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

// Deklarasi API key dan domain
const apikey = 'ptla_NrSSRjczpiA1ZB2wxRXHDpNOSSkkhKvuVFf3Xnek0vv';
const domain = 'https://xyrezz-official.online-server.biz.id';

// Middleware untuk meng-handle JSON body
app.use(express.json());
app.use(express.static('public'));  // Untuk mengakses file statis seperti CSS dan JS

// Endpoint untuk membuat panel
app.post('/create-panel', async (req, res) => {
    const { username, password, ram, disk, cpu, email } = req.body;

    // Validasi input
    if (!username || !password || !ram || !disk || !cpu || !email) {
        return res.status(400).json({ error: 'Semua data wajib diisi' });
    }

    // Membuat data panel untuk dikirim ke API
    const panelData = {
        username: username,
        password: password,
        email: email,
        ram: ram,
        disk: disk,
        cpu: cpu,
        loginLink: `${domain}/login`
    };

    try {
        const response = await fetch(`${domain}/api/application/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apikey}`
            },
            body: JSON.stringify({
                email: email,
                username: username,
                first_name: username,
                last_name: username,
                password: password
            })
        });

        const data = await response.json();

        if (data.errors) {
            return res.status(500).json({ error: 'Gagal membuat server', details: data.errors });
        }

        // Mengirimkan data panel ke frontend setelah berhasil
        res.json({
            message: 'Server berhasil dibuat!',
            panelData: panelData
        });

    } catch (error) {
        console.error('Terjadi kesalahan saat membuat server:', error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
