
// Install dependencies
// npm install express body-parser cors node-fetch

const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (e.g., CSS, JS)
app.use(express.static('public'));

const API_KEY = 'ptla_NrSSRjczpiA1ZB2wxRXHDpNOSSkkhKvuVFf3Xnek0vv'; // Replace with your actual API key
const DOMAIN = 'https://xyrezz-official.online-server.biz.id'; // Replace with your actual domain

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Server Panel Creator</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 50px; }
        form { max-width: 400px; margin: auto; }
        label { display: block; margin: 10px 0 5px; }
        input, select, button { width: 100%; padding: 10px; margin-bottom: 15px; }
      </style>
    </head>
    <body>
      <h1>Create Your Panel</h1>
      <form id="panel-form">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required />

        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required />

        <label for="ram">RAM (1GB to 10GB):</label>
        <select id="ram" name="ram">
          ${Array.from({ length: 10 }, (_, i) => `<option value="${(i + 1) * 1024}">${i + 1}GB</option>`).join('')}
        </select>

        <button type="submit">Create Panel</button>
      </form>

      <div id="result" style="margin-top: 20px; display: none;">
        <h2>Panel Data</h2>
        <pre id="panel-data"></pre>
      </div>

      <script>
        const form = document.getElementById('panel-form');
        const resultDiv = document.getElementById('result');
        const panelData = document.getElementById('panel-data');

        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          const formData = new FormData(form);
          const data = Object.fromEntries(formData.entries());

          try {
            const response = await fetch('/create-panel', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });

            const result = await response.json();
            resultDiv.style.display = 'block';
            panelData.textContent = JSON.stringify(result, null, 2);
          } catch (error) {
            alert('Error creating panel: ' + error.message);
          }
        });
      </script>
    </body>
    </html>
  `);
});

app.post('/create-panel', async (req, res) => {
  const { name, password, ram } = req.body;

  try {
    const email = `${name}@example.com`;
    const userResponse = await fetch(`${DOMAIN}/api/application/users`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        email,
        username: name,
        first_name: name,
        last_name: name,
        password,
        language: 'en',
      }),
    });

    const userData = await userResponse.json();
    if (userData.errors) return res.status(400).json({ errors: userData.errors });

    const user = userData.attributes;
    const serverResponse = await fetch(`${DOMAIN}/api/application/servers`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        name,
        user: user.id,
        egg: 15, // Replace with your egg ID
        docker_image: 'ghcr.io/parkervcp/yolks:nodejs_18',
        startup: 'npm start',
        environment: { CMD_RUN: 'npm start' },
        limits: { memory: parseInt(ram), disk: 10240, cpu: 50 },
      }),
    });

    const serverData = await serverResponse.json();
    if (serverData.errors) return res.status(400).json({ errors: serverData.errors });

    res.json({
      user: { username: user.username, email: user.email },
      server: { id: serverData.attributes.id, name: serverData.attributes.name },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
