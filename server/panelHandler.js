const fetch = require('node-fetch');
const fs = require('fs');

const panelHandler = async (req, res) => {
  const { username, password, ram } = req.body;

  if (!username || !password || !ram) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Ganti dengan API dan URL yang sesuai
    const domain = 'https://xyrezz-official.online-server.biz.id';
    const apikey = 'ptla_NrSSRjczpiA1ZB2wxRXHDpNOSSkkhKvuVFf3Xnek0vv';
    const egg = '15'; // Sesuaikan dengan ID egg yang dibutuhkan

    // Request untuk membuat panel
    const userData = await fetch(`${domain}/api/application/users`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apikey}`,
      },
      body: JSON.stringify({
        email: `${username}@gmail.com`,
        username,
        first_name: username,
        last_name: username,
        password,
      }),
    });

    const data = await userData.json();
    if (data.errors) {
      return res.status(400).json({ error: data.errors[0] });
    }

    const user = data.attributes;

    // Informasi panel
    const panelData = {
      username: user.username,
      password,
      ram,
      disk: '1025',
      cpu: '50',
      panelLink: `${domain}/panel-login`,
    };

    // Kirim pop-up atau data panel (di halaman web)
    return res.json({ message: 'Panel created successfully!', panelData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = panelHandler;
