document.addEventListener("DOMContentLoaded", function () {
    const ventanaModal = document.getElementById("videoModal");
    const iframeVideo = document.getElementById("modalVideo");
    const overlays = document.querySelectorAll(".overlay");
    const closeModalButton = document.querySelector(".close");

    // Evento al hacer clic en cualquier overlay
    overlays.forEach(overlay => {
        overlay.addEventListener("click", function () {
            let videoSrc = this.getAttribute("data-srclocalvideo"); // Obtener URL del video
            if (videoSrc) {
                iframeVideo.src = videoSrc + "?autoplay=1";
                ventanaModal.style.display = "flex"; // Mostrar modal (sin la clase aún)
                setTimeout(() => ventanaModal.classList.add("show"), 10); // Activar animación
            }
        });
    });

    // Función para cerrar el modal con animación
    function closeModal() {
        ventanaModal.classList.remove("show"); // Quitar la clase de animación
        setTimeout(() => {
            ventanaModal.style.display = "none"; // Ocultar después de la animación
            iframeVideo.src = ""; // Detener el video
        }, 300); // Tiempo igual al de la animación CSS
    }

    // Evento para cerrar el modal con el botón
    closeModalButton.addEventListener("click", closeModal);

    // Cerrar modal si se hace clic fuera de la caja
    window.addEventListener("click", function (e) {
        if (e.target === ventanaModal) {
            closeModal();
        }
    });
});
