document.getElementById('panel-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const ram = document.getElementById('ram').value;

    const response = await fetch('/create-panel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, ram }),
    });

    const data = await response.json();

    if (response.ok) {
        const popup = document.getElementById('popup');
        const panelInfo = document.getElementById('panel-info');
        panelInfo.textContent = JSON.stringify(data.panelData, null, 2);
        popup.style.display = 'flex';
    } else {
        alert('Error: ' + data.error);
    }
});

document.getElementById('close-popup').addEventListener('click', () => {
    document.getElementById('popup').style.display = 'none';
});
