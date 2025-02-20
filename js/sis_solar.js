// Selecciona el contenedor del carrusel y los botones de control
const cardsContainer = document.querySelector(".carousel");
const leftButton = document.querySelector(".carousel-control.left");
const rightButton = document.querySelector(".carousel-control.right");

class CardCarousel {
    constructor(container) {
        // Elementos del DOM: el contenedor y todas las tarjetas (items) del carrusel
        this.container = container;
        this.cards = container.querySelectorAll(".carousel-item");

        // Datos del carrusel:
        // Calcula el índice central (por ejemplo, si hay 5 items, centerIndex será 2)
        this.centerIndex = (this.cards.length - 1) / 2;
        // Calcula el ancho de una tarjeta en porcentaje respecto al contenedor
        this.cardWidth = (this.cards[0].offsetWidth / this.container.offsetWidth) * 100;
        // Objeto para almacenar la posición (x) asignada a cada tarjeta
        this.xScale = {};

        // Escuchar cambios en el tamaño de la ventana para recalcular el ancho de las tarjetas
        window.addEventListener("resize", this.updateCardWidth.bind(this));

        // Agregar controladores para los botones izquierdo y derecho
        leftButton.addEventListener("click", () => this.moveLeft());
        rightButton.addEventListener("click", () => this.moveRight());

        // Inicializar la construcción del carrusel
        this.build();
    }

    updateCardWidth() {
        // Actualiza el ancho de la tarjeta y reconstruye el carrusel en caso de cambio de tamaño
        this.cardWidth = (this.cards[0].offsetWidth / this.container.offsetWidth) * 100;
        this.build();
    }

    build() {
        // Recorre cada tarjeta y calcula su posición, escala y z-index
        for (let i = 0; i < this.cards.length; i++) {
            // x es la posición relativa al centro
            const x = i - this.centerIndex;
            const scale = this.calcScale(x);
            const scale2 = this.calcScale2(x);
            // El z-index se determina en función de la distancia al centro
            const zIndex = -(Math.abs(i - this.centerIndex));
            // Calcula la posición horizontal (left) en porcentaje
            const leftPos = this.calcPos(x, scale2);

            // Asigna la tarjeta a su posición en el objeto xScale
            this.xScale[x] = this.cards[i];

            // Actualiza los estilos de la tarjeta con los valores calculados
            this.updateCards(this.cards[i], {
                x: x,
                scale: scale,
                leftPos: leftPos,
                zIndex: zIndex
            });
        }
        // Una vez construido el layout, muestra la info correspondiente al item central
        this.showInfoForCurrentCard();
    }

    moveLeft() {
        // Mueve el carrusel a la izquierda: disminuye el valor de x para cada tarjeta
        const temp = { ...this.xScale };

        for (let x in this.xScale) {
            // Si el nuevo valor de x es menor que -centerIndex, se reinicia al otro extremo
            const newX = (parseInt(x) - 1 < -this.centerIndex) ? this.centerIndex : parseInt(x) - 1;
            temp[newX] = this.xScale[x];
        }

        this.xScale = temp;
        this.updateCardsPosition();
    }

    moveRight() {
        // Mueve el carrusel a la derecha: aumenta el valor de x para cada tarjeta
        const temp = { ...this.xScale };

        for (let x in this.xScale) {
            // Si el nuevo valor de x es mayor que centerIndex, se reinicia al otro extremo
            const newX = (parseInt(x) + 1 > this.centerIndex) ? -this.centerIndex : parseInt(x) + 1;
            temp[newX] = this.xScale[x];
        }

        this.xScale = temp;
        this.updateCardsPosition();
    }

    updateCardsPosition() {
        // Agrega una clase para la transición suave (animación)
        this.container.classList.add("smooth-return");

        // Actualiza la posición, escala y z-index de cada tarjeta según su nuevo valor x
        for (let x in this.xScale) {
            const scale = this.calcScale(x);
            const scale2 = this.calcScale2(x);
            const leftPos = this.calcPos(x, scale2);
            const zIndex = -Math.abs(x);

            this.updateCards(this.xScale[x], {
                x: x,
                scale: scale,
                leftPos: leftPos,
                zIndex: zIndex
            });
        }
        // Una vez actualizadas las posiciones, muestra la info del item central (donde data-x="0")
        this.showInfoForCurrentCard();
    }

    calcPos(x, scale) {
        // Calcula la posición left en porcentaje para la tarjeta, considerando un espacio (gap)
        let gap = 4;
        return 39 + x * (this.cardWidth + gap) / 2;
    }

    updateCards(card, data) {
        // Actualiza el atributo data-x para identificar la posición de la tarjeta
        if (data.x || data.x === 0) {
            card.setAttribute("data-x", data.x);
        }

        // Aplica la transformación de escala y ajusta la opacidad
        if (data.scale || data.scale === 0) {
            card.style.transform = `scale(${data.scale})`;
            card.style.opacity = data.scale == 0 ? data.scale : 1;
        }

        // Establece la posición horizontal (left)
        if (data.leftPos || data.leftPos === 0) {
            card.style.left = `${data.leftPos}%`;
        }

        // Establece el z-index para superponer correctamente y resalta la tarjeta central
        if (data.zIndex || data.zIndex === 0) {
            if (data.zIndex == 0) {
                card.classList.add("highlight");
            } else {
                card.classList.remove("highlight");
            }
            card.style.zIndex = data.zIndex;
        }
    }

    calcScale2(x) {
        // Calcula un factor secundario de escala (para ajustar la posición) basado en x
        if (x <= 0) {
            return 1 - (-1 / 5 * x);
        } else if (x > 0) {
            return 1 - (1 / 5 * x);
        }
    }

    calcScale(x) {
        // Calcula el factor de escala usando una fórmula cuadrática
        const formula = 1 - (1 / 5) * Math.pow(x, 2);
        return formula <= 0 ? 0 : formula;
    }

    showInfoForCurrentCard() {
        // Busca la tarjeta que tiene data-x igual a "0", que es la tarjeta central
        const centerCard = Array.from(this.cards).find(card => card.getAttribute("data-x") === "0");
        if (!centerCard) return; // Si no se encuentra, sale de la función

        // Se asume que el id de la tarjeta tiene el formato "itemX"
        const itemNumber = centerCard.id.replace('item', '');

        // Oculta todas las cajas .info que estén activas
        document.querySelectorAll(".info.active").forEach(info => {
            info.classList.remove("active");
        });

        // Busca y muestra el div .info correspondiente (por ejemplo, "#info5" para item5)
        const infoBox = document.querySelector(`#info${itemNumber}`);
        if (infoBox) {
            infoBox.classList.add("active");
        }
    }
}

// Inicializa el carrusel pasándole el contenedor
const carousel = new CardCarousel(cardsContainer);

// Al cargar el contenido de la página:
document.addEventListener("DOMContentLoaded", function () {
    // Muestra la información correspondiente al item central (data-x = "0")
    carousel.showInfoForCurrentCard();

    // Opcional: escucha el evento "transitionend" para actualizar la info una vez finalizada la animación
    cardsContainer.addEventListener("transitionend", function () {
        carousel.showInfoForCurrentCard();
    });
});

//Control del comportamiento del sidebar
function countdown() {
    const eventDate = new Date("February 25, 2025 00:00:00").getTime();
    const now = new Date().getTime();
    const timeLeft = eventDate - now;

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("event-timer").innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
setInterval(countdown, 1000);