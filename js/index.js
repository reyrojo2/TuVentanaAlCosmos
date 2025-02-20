// Acción al hacer clic en el botón "OK"
document.getElementById('okButton').addEventListener('click', function () {
    var audio = document.getElementById('BackgroundAudio');
    audio.play(); // Reproducir la música
    // Ocultar el widget después de hacer clic en "OK"
    document.getElementById('immersiveWidget').style.display = 'none';
});

// Acción al hacer clic en el botón "NO"
document.getElementById('noButton').addEventListener('click', function () {
    // Ocultar el widget después de hacer clic en "OK"
    document.getElementById('immersiveWidget').style.display = 'none';
});
