const fetch = require('node-fetch');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { username, password, ram, email } = req.body;

    if (!username || !password || !ram || !email) {
        return res.status(400).json({ error: 'Semua data wajib diisi' });
    }

    // API key dan domain yang akan digunakan
    const apikey = 'ptla_NrSSRjczpiA1ZB2wxRXHDpNOSSkkhKvuVFf3Xnek0vv';
    const domain = 'https://xyrezz-official.online-server.biz.id';

    // Membuat data panel untuk dikirim ke API
    const panelData = {
        username: username,
        password: password,
        email: email,
        ram: ram,
        disk: '10GB', // Misal default disk 10GB
        cpu: '2 CPU', // Misal default CPU 2
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

        res.status(200).json({
            message: 'Server berhasil dibuat!',
            panelData: panelData
        });

    } catch (error) {
        console.error('Terjadi kesalahan saat membuat server:', error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });
    }
}
