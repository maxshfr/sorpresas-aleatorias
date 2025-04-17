// Base URL de tu API Gateway. Asegúrate de apuntar a los recursos correctos:
const API_BASE = 'https://iogk6qtqg1.execute-api.us-east-2.amazonaws.com/default';

document.getElementById('payButton').addEventListener('click', () => {
  // 1) Llamas a la Lambda "crear-pago"
  fetch(`${API_BASE}/crear-pago`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(json => {
    if (json.approval_url) {
      // Rediriges al usuario a PayPal
      window.location.href = json.approval_url;
    } else {
      alert('Error al iniciar el pago. Intenta de nuevo.');
      console.error(json);
    }
  })
  .catch(err => {
    console.error('Error creando pago:', err);
    alert('No se pudo procesar tu pago.');
  });
});

// 2) Cuando PayPal redirija de vuelta con ?success=true&paymentId=...&PayerID=...
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === 'true') {
    const paymentId = params.get('paymentId');
    const PayerID   = params.get('PayerID');

    // Llamas a la Lambda "confirmar-pago"
    fetch(`${API_BASE}/confirmar-pago`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId, PayerID })
    })
    .then(res => res.json())
    .then(json => {
      if (json.sorpresa) {
        document.getElementById('surprise').innerHTML = json.sorpresa;
      } else {
        document.getElementById('surprise').innerText = 'El pago no fue aprobado.';
      }
    })
    .catch(err => {
      console.error('Error confirmando pago:', err);
      document.getElementById('surprise').innerText = 'Error al confirmar el pago.';
    });
  }
});
