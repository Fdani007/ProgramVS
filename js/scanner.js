let html5QrCode = null; // Variable global para no duplicar la cámara

async function iniciarEscaner() {
    const readerDiv = document.getElementById("reader");
    const btnStop = document.getElementById("btnStop");

    // 1. Limpieza: Si ya existe una instancia activa, la detenemos
    if (html5QrCode && html5QrCode.isScanning) {
        await html5QrCode.stop();
    }

    // 2. Nueva instancia
    html5QrCode = new Html5Qrcode("reader");
    readerDiv.style.display = "block";
    btnStop.style.display = "block";

    // 3. Configuración específica para BARRAS (EAN y UPC)
    const config = {
        fps: 20, // Más frames = más intentos de lectura por segundo
        qrbox: { width: 300, height: 120 }, // Rectángulo horizontal para barras
        aspectRatio: 1.0,
        formatsToSupport: [ 
            Html5QrcodeSupportedFormats.EAN_13, 
            Html5QrcodeSupportedFormats.UPC_A, 
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.CODE_128 
        ]
    };

    try {
        await html5QrCode.start(
            { facingMode: "environment" }, // Usa la cámara trasera
            config,
            async (text) => {
                console.log("Código detectado:", text);
                
                // Llenamos el campo de texto
                document.getElementById("txtCodigo").value = text;
                
                // DETENER CÁMARA CORRECTAMENTE
                await detenerEscanerCámara();
                
                // LANZA VERIFICACIÓN AUTOMÁTICA
                ui.verificarExistencia(text);
            }
        );
    } catch (err) {
        console.error("Error al iniciar cámara:", err);
        alert("Asegúrate de estar en HTTPS y dar permisos a la cámara.");
    }
}

// Función auxiliar para apagar todo
async function detenerEscanerCámara() {
    if (html5QrCode) {
        await html5QrCode.stop();
        html5QrCode = null; // Liberamos la memoria
        document.getElementById("reader").style.display = "none";
        document.getElementById("btnStop").style.display = "none";
    }
}