const token = "TOKEN";
// const public_key = "PUBLIC_KEY";
// const secret_key = "SECRET_KEY";

const gbprimepay = new GBPrimePay();

gbprimepay.promptpay({
    amount: '10.00',
    referenceNo: 'PP1234',
    backgroundUrl: 'https://dev.0x01code.me/gbprimepay.webhook.php',
}, token)
.then(qrcode => {
    const img = document.createElement('img');
    img.src = qrcode;
    document.body.appendChild(img);
})
.catch(error => console.log(error))