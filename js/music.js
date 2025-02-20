const audio = document.getElementById('miReproductor');
audio.volume = 0.2;

const listaDeCanciones = [
    { nombre: 'Love', archivo: '../audio/love.mp3' },
    { nombre: 'No Gravity', archivo: '../audio/no-gravity.mp3' },
    { nombre: 'Ray', archivo: '../audio/ray.mp3' },
    { nombre: 'Waiting For', archivo: '../audio/waiting-for.mp3' }
];

let indiceActual = localStorage.getItem('cancionActual') ? parseInt(localStorage.getItem('cancionActual')) : 0;
const nombreCancionElement = document.getElementById('nombreCancion');

// Restaurar el tiempo y estado de reproducción solo si la canción es la misma
const tiempoGuardado = localStorage.getItem('tiempoAudio') ? parseFloat(localStorage.getItem('tiempoAudio')) : 0;
const ultimaCancion = localStorage.getItem('cancionActual');
const estabaReproduciendo = localStorage.getItem('estaReproduciendo') === 'true';

// Si la canción es la misma, restaurar el tiempo
if (ultimaCancion == indiceActual) {
    audio.currentTime = tiempoGuardado;
}

// Función para cambiar la canción
function cambiarCancion() {
    audio.src = listaDeCanciones[indiceActual].archivo;

    // Si se cambia de canción, reiniciar el tiempo a 0
    audio.addEventListener('loadedmetadata', () => {
        audio.currentTime = (ultimaCancion == indiceActual) ? tiempoGuardado : 0;
        if (estabaReproduciendo) {
            audio.play();
        }
    }, { once: true });

    mostrarNombreCancion();
    fadeInOut();
}


// Mostrar el nombre de la canción
function mostrarNombreCancion() {
    nombreCancionElement.innerText = listaDeCanciones[indiceActual].nombre;
    nombreCancionElement.style.opacity = 0.8;
    setTimeout(() => {
        nombreCancionElement.style.opacity = 0;
    }, 5000);
}

// Manejo del evento 'ended' para cambiar a la siguiente canción
audio.addEventListener('ended', () => {
    indiceActual = (indiceActual + 1) % listaDeCanciones.length;
    localStorage.setItem('cancionActual', indiceActual);
    cambiarCancion();
});

// Guardar el tiempo de reproducción antes de cambiar de página
window.addEventListener('beforeunload', () => {
    localStorage.setItem('tiempoAudio', audio.currentTime);
    localStorage.setItem('cancionActual', indiceActual);
    localStorage.setItem('estaReproduciendo', !audio.paused);
});

// Guardar el estado cuando se pausa o se reproduce
audio.addEventListener('play', () => {
    localStorage.setItem('estaReproduciendo', true);
});

audio.addEventListener('pause', () => {
    localStorage.setItem('estaReproduciendo', false);
});

// Iniciar la reproducción con el estado guardado
cambiarCancion();
audio.currentTime = tiempoGuardado;
