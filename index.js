const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Parse incoming JSON requests

// API Key and Domain
const apikey = 'ptla_NrSSRjczpiA1ZB2wxRXHDpNOSSkkhKvuVFf3Xnek0vv';
const domain = 'https://xyrezz-official.online-server.biz.id';

// Route to create panel
app.post('/api/create-panel', async (req, res) => {
    const { username, password, ram } = req.body;

    if (!username || !password || !ram) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Creating user through API
        const email = `${username}@gmail.com`;

        const userResponse = await fetch(`${domain}/api/application/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apikey}`,
            },
            body: JSON.stringify({
                email: email,
                username: username,
                first_name: username,
                last_name: username,
                language: 'en',
                password: password,
            }),
        });

        const userData = await userResponse.json();

        if (userData.errors) {
            return res.status(400).json({ error: 'Error creating user' });
        }

        const userId = userData.attributes.id;
        const eggId = '15'; // example egg ID
        const serverResponse = await fetch(`${domain}/api/application/servers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apikey}`,
            },
            body: JSON.stringify({
                name: username,
                user: userId,
                egg: eggId,
                limits: {
                    memory: ram,
                    cpu: 50,
                    disk: 1025,
                },
            }),
        });

        const serverData = await serverResponse.json();

        if (serverData.errors) {
            return res.status(400).json({ error: 'Error creating server' });
        }

        // Return success response
        res.json({
            username: username,
            password: password,
            ram: ram,
            disk: 1025,
            loginLink: `${domain}/login`, // Assuming you have a login page
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
