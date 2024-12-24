app.post('/api/create-panel', async (req, res) => {
    const { username, password, ram } = req.body;

    console.log("Request received: ", req.body);  // Debugging line

    if (!username || !password || !ram) {
        console.log("Missing required fields");
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Your existing code to create user and server
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

        console.log("User creation response: ", await userResponse.json());  // Debugging line

        // Additional code ...
    } catch (error) {
        console.log("Error: ", error);  // Debugging line
        res.status(500).json({ error: 'Internal server error' });
    }
});
