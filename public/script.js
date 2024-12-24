document.getElementById("createPanelForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const ram = document.getElementById("ram").value;

    const response = await fetch('/api/create-panel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password,
            email: email,
            ram: ram
        })
    });

    const result = await response.json();

    const resultDiv = document.getElementById("result");

    if (response.ok) {
        resultDiv.innerHTML = `
            <h2>Panel Created Successfully!</h2>
            <p>Username: ${result.panelData.username}</p>
            <p>Password: ${result.panelData.password}</p>
            <p>RAM: ${result.panelData.ram}</p>
            <p>Disk: ${result.panelData.disk}</p>
            <p>Login Link: <a href="${result.panelData.loginLink}" target="_blank">Login to Panel</a></p>
        `;
    } else {
        resultDiv.innerHTML = `<p style="color: red;">Error: ${result.error}</p>`;
    }
});
