// CONFIGURACIÓN DEL TIEMPO (En milisegundos)
// Cambia esto a (10 * 1000) si quieres probar el crecimiento rápido (10 segundos) en clase.
const TIEMPO_DIA = 24 * 60 * 60 * 1000; 

document.addEventListener("DOMContentLoaded", () => {
    // CORRECCIÓN VITAL: Vinculamos los botones al iniciar la página, pase lo que pase
    const waterBtn = document.getElementById("water-btn");
    const resetBtn = document.getElementById("reset-btn");

    if (waterBtn) {
        waterBtn.addEventListener("click", waterPlant);
    }
    if (resetBtn) {
        resetBtn.addEventListener("click", resetPlant);
    }

    // Ahora sí, revisamos cómo está el jardín
    verificarEstadoJardin();
});

function verificarEstadoJardin() {
    const rosal = document.getElementById("rosal");
    const waterBtn = document.getElementById("water-btn");
    const resetBtn = document.getElementById("reset-btn");
    const statusText = document.getElementById("status-text");
    const dayNumber = document.getElementById("day-number");

    let ultimoRiego = null;
    let diaActual = 1;

    // PARCHE DE SEGURIDAD LOCAL
    try {
        ultimoRiego = localStorage.getItem("rosal_ultimo_riego");
        diaActual = parseInt(localStorage.getItem("rosal_dia_actual")) || 1;
    } catch (e) {
        console.log("LocalStorage bloqueado localmente. Corriendo en modo demostración.");
    }

    // LÓGICA AUTOMÁTICA DÍA 1 (Usuario completamente nuevo)
    if (!ultimoRiego) {
        configurarFaseVisual(1);
        statusText.innerText = "¡Esqueje plantado con éxito! Tu rosal necesita agua para comenzar a crecer. ¡Dale su primer riego!";
        waterBtn.disabled = false; // Permitimos que el usuario nuevo interactúe de inmediato
        dayNumber.innerText = 1;
        return;
    }

    const ahora = new Date().getTime();
    const tiempoTranscurrido = ahora - parseInt(ultimoRiego);

    dayNumber.innerText = diaActual;

    // REGLA DE ABANDONO INTERMEDIO (Marchitándose)
    if (tiempoTranscurrido > (TIEMPO_DIA * 1.5) && tiempoTranscurrido <= (TIEMPO_DIA * 3)) {
        rosal.className = "estado-debil";
        statusText.innerText = "La tierra está agrietada y el rosal se está doblando por deshidratación. ¡Riégalo ya!";
        waterBtn.disabled = false;
        waterBtn.style.display = "inline-block";
        resetBtn.style.display = "none";
        return;
    }

    // REGLA DE ABANDONO TOTAL (Muerto)
    if (tiempoTranscurrido > (TIEMPO_DIA * 3)) {
        rosal.className = "estado-muerto";
        statusText.innerText = "Olvidaste cuidar tu jardín... El rosal se ha secado y muerto por completo.";
        waterBtn.style.display = "none";
        resetBtn.style.display = "inline-block";
        return;
    }

    // REGLA DE ESPERA (Ya se regó hoy)
    if (tiempoTranscurrido < TIEMPO_DIA) {
        configurarFaseVisual(diaActual);
        statusText.innerText = "El rosal absorbe los nutrientes correctamente. Vuelve mañana para hidratarlo.";
        waterBtn.disabled = true;
        waterBtn.style.display = "inline-block";
        resetBtn.style.display = "none";
        return;
    }

    // REGLA DISPONIBLE (Listo para regar)
    configurarFaseVisual(diaActual);
    statusText.innerText = "El suelo se ha secado. Tu rosal necesita agua para continuar su desarrollo.";
    waterBtn.disabled = false;
    waterBtn.style.display = "inline-block";
    resetBtn.style.display = "none";
}

function waterPlant() {
    const rosal = document.getElementById("rosal");
    const waterBtn = document.getElementById("water-btn");
    let diaActual = 1;

    try {
        diaActual = parseInt(localStorage.getItem("rosal_dia_actual")) || 1;
    } catch(e) {}

    rosal.classList.add("watering");
    waterBtn.disabled = true;

    const ahora = new Date().getTime();
    
    // Si era el primer riego real, avanzamos el día de forma correcta
    diaActual++;

    try {
        localStorage.setItem("rosal_ultimo_riego", ahora);
        localStorage.setItem("rosal_dia_actual", diaActual);
    } catch(e) {}

    setTimeout(() => {
        rosal.classList.remove("watering");
        verificarEstadoJardin();
    }, 1500);
}

function configurarFaseVisual(dia) {
    const rosal = document.getElementById("rosal");
    
    if (dia === 1) {
        rosal.className = "fase-1";
    } else if (dia <= 3) {
        rosal.className = "fase-2";
    } else if (dia <= 6) {
        rosal.className = "fase-3";
    } else {
        rosal.className = "fase-4";
        document.getElementById("status-text").innerText = "Tu constancia mantiene el rosal en su máximo esplendor. 🖤";
    }
}

function resetPlant() {
    try {
        localStorage.removeItem("rosal_ultimo_riego");
        localStorage.removeItem("rosal_dia_actual");
    } catch(e) {}
    
    document.getElementById("water-btn").style.display = "inline-block";
    document.getElementById("reset-btn").style.display = "none";
    
    verificarEstadoJardin();
}