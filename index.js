const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/create-panel', (req, res) => {
    const { username, password, ram, disk, cpu, email } = req.body;

    // Simulasi pembuatan server
    const serverData = {
        username: username,
        password: password,
        email: email,
        ram: ram,
        disk: disk,
        cpu: cpu,
        loginLink: "https://your-domain.com/login"
    };

    // Mengembalikan data sebagai respon
    res.json(serverData);
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
