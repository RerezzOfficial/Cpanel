const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, password, ram } = req.body;

  if (!name || !password || !ram) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Simulasi API untuk pembuatan panel
  try {
    const apikey = 'ptla_NrSSRjczpiA1ZB2wxRXHDpNOSSkkhKvuVFf3Xnek0vv'; // Ganti dengan API Key Anda
    const domain = 'https://xyrezz-official.online-server.biz.id/'; // Ganti dengan domain panel Anda

    // Membuat user
    const userResponse = await fetch(`${domain}/api/application/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apikey}`
      },
      body: JSON.stringify({
        email: `${name}@example.com`,
        username: name,
        first_name: name,
        last_name: name,
        password
      })
    });

    const userData = await userResponse.json();
    if (userResponse.status !== 200) {
      return res.status(500).json({ message: userData.errors[0].detail });
    }

    // Simulasi hasil
    res.status(200).json({
      username: name,
      password,
      ram
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
