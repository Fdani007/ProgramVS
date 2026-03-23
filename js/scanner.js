function iniciarEscaner(callbackSuccess) {
    const html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: { width: 250, height: 150 } };

    html5QrCode.start(
        { facingMode: "environment" }, 
        config, 
        (decodedText) => {
            html5QrCode.stop(); // Detenemos la cámara tras leer
            callbackSuccess(decodedText);
            document.getElementById('reader').style.display = 'none';
        }
    );
}
