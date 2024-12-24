document.getElementById('create-panel-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const ram = document.getElementById('ram').value;
    const disk = document.getElementById('disk').value;
    const cpu = document.getElementById('cpu').value;
    const email = document.getElementById('email').value;

    const response = await fetch('http://localhost:3000/create-panel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
            ram,
            disk,
            cpu,
            email
        })
    });

    const data = await response.json();

    if (data.message) {
        // Tampilkan popup dengan data panel
        document.getElementById('popup-content').textContent = JSON.stringify(data.panelData, null, 2);
        document.getElementById('popup').style.display = 'block';
        document.getElementById('overlay').style.display = 'block';
    }
});

document.getElementById('close-popup').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});
