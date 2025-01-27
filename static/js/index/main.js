//SECTION - IMPORTS
import { log } from './helper.js';
import { loadWorkEntries } from './render.js';
// import {  } from './modals.js';
// import {  } from './api.js';
//!SECTION - IMPORTS


//SECTION - FUNCTION: loadWorkEntries
log('Die Anwendung läuft im "Develop-Modus" -> Alle logs sind eingeschaltet:');
loadWorkEntries(); // Inizialisierung

const yearSelect = document.getElementById('yearFilter');
const monthSelect = document.getElementById('monthFilter');

//ANCHOR - Event-Listener-Filter-Change-Year
yearSelect.addEventListener('change', function () {
    loadWorkEntries(parseInt(yearSelect.value), parseInt(monthSelect.value));
});

//ANCHOR - Event-Listener-Filter-Change-Month
monthSelect.addEventListener('change', function () {
    loadWorkEntries(parseInt(yearSelect.value), parseInt(monthSelect.value));
});
