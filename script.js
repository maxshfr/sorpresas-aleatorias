document.getElementById('payButton').addEventListener('click', function() {
    // Hacer una solicitud POST a la API de AWS Lambda para crear el pago con PayPal
    fetch('https://iogk6qtqg1.execute-api.us-east-2.amazonaws.com/default', {  // Cambia <API_GATEWAY_URL> por la URL de tu API Gateway
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})  // Si necesitas enviar algún dato adicional en el body, añádelo aquí.
    })
    .then(response => response.json())
    .then(data => {
        // Si la creación del pago es exitosa, redirige al usuario a PayPal
        if (data && data.approval_url) {
            window.location.href = data.approval_url;
        } else {
            alert('Error al iniciar el pago. Intenta de nuevo.');
        }
        
        // Solo carga las frases después de hacer clic en el botón de pago
        fetch('/frases/frases.txt') // Asegúrate de que la URL sea correcta
          .then(response => response.text()) // Obtén el contenido del archivo como texto
          .then(data => {
            const frases = data.split("\n"); // Separa las frases por líneas
            const sorpresa = `<p>${frases[Math.floor(Math.random() * frases.length)]}</p>`;
            document.getElementById('surprise').innerHTML = sorpresa; // Muestra la sorpresa
          })
          .catch(error => {
            console.error('Error al cargar la sorpresa:', error);
            document.getElementById('surprise').innerHTML = 'Hubo un error al cargar la sorpresa.';
          });
    })
    .catch(error => {
        console.error('Error al crear el pago:', error);
        alert('Hubo un error al procesar tu solicitud. Intenta de nuevo.');
    });
});
