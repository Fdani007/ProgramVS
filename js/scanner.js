async function iniciarEscaner() {
    const html5QrCode = new Html5Qrcode("reader");
    document.getElementById("reader").style.display = "block";
    document.getElementById("btnStop").style.display = "block";

    await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 15, qrbox: { width: 300, height: 150 } },
        async (text) => {
            document.getElementById("txtCodigo").value = text;
            await html5QrCode.stop();
            document.getElementById("reader").style.display = "none";
            document.getElementById("btnStop").style.display = "none";
            // LANZA VERIFICACIÓN AUTOMÁTICA
            ui.verificarExistencia(text);
        }
    );
}