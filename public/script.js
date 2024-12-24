document.getElementById('create-panel-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const ram = document.getElementById('ram').value;
    const email = document.getElementById('email').value;

    const resultElement = document.getElementById('result');
    resultElement.innerHTML = 'Loading...'; // Menampilkan loading saat proses berlangsung

    try {
        const response = await fetch('/api/create-panel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                ram,
                email,
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Jika berhasil, tampilkan data panel
            resultElement.innerHTML = `
                <h2>Panel Created Successfully!</h2>
                <p><strong>Username:</strong> ${data.panelData.username}</p>
                <p><strong>Password:</strong> ${data.panelData.password}</p>
                <p><strong>RAM:</strong> ${data.panelData.ram}</p>
                <p><strong>Disk:</strong> ${data.panelData.disk}</p>
                <p><strong>CPU:</strong> ${data.panelData.cpu}</p>
                <p><strong>Login Link:</strong> <a href="${data.panelData.loginLink}" target="_blank">${data.panelData.loginLink}</a></p>
            `;
        } else {
            // Jika ada error, tampilkan pesan error
            resultElement.innerHTML = `<span style="color: red;">Error: ${data.error || 'Unknown Error'}</span>`;
        }
    } catch (error) {
        // Menampilkan error jika fetch gagal
        resultElement.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
    }
});
