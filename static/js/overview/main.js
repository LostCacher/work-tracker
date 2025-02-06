//SECTION - IMPORTS
import { log } from './helper.js';
import { loadOverviewEntries } from './render.js';
//!SECTION - IMPORTS


//SECTION - Inizialisierung
log('Die Anwendung läuft im "Develop-Modus" -> Alle logs sind eingeschaltet:');
loadOverviewEntries();

// Tooltips initialisieren
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(tooltipTriggerEl => {
    new bootstrap.Tooltip(tooltipTriggerEl);
});
//!SECTION - Inizialisierung


//SECTION - Event Listener

//ANCHOR - Filter Change
const yearSelect = document.getElementById('yearFilter');;

[yearSelect].forEach(select => {
    select.addEventListener('change', function () {
        loadOverviewEntries(parseInt(yearSelect.value));
    });
});
//!SECTION - Event Listener


//SECTION - Auto Logout
let logoutTimer;

function resetLogoutTimer() {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
        window.location.href = logoutUrl; // Verwende die übergebene URL
    }, 1800000); // 30 Minuten in Millisekunden 1800000
}

document.onload = resetLogoutTimer;
document.onmousemove = resetLogoutTimer;
document.onclick = resetLogoutTimer;
document.onscroll = resetLogoutTimer;
//!SECTION - Auto Logout
