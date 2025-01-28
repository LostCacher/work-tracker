//SECTION - IMPORTS
import { log, setDefaultTimes } from './helper.js';
import { loadWorkEntries } from './render.js';
// import {  } from './modals.js';
import { saveLogic } from './api.js';
//!SECTION - IMPORTS


//SECTION - Inizialisierung
log('Die Anwendung läuft im "Develop-Modus" -> Alle logs sind eingeschaltet:');
loadWorkEntries();
//!SECTION - Inizialisierung


//SECTION - Event Listener

//ANCHOR - Filter Change
const yearSelect = document.getElementById('yearFilter');
const monthSelect = document.getElementById('monthFilter');

[yearSelect, monthSelect].forEach(select => {
    select.addEventListener('change', function () {
        loadWorkEntries(parseInt(yearSelect.value), parseInt(monthSelect.value));
    });
});

//ANCHOR - Add Modal
const shiftAddModal = document.getElementById("modal__add--shift");
const dateAddModal = document.getElementById("modal__add--date");

dateAddModal.addEventListener('input', () => {
    setDefaultTimes(shiftAddModal.value, dateAddModal.value);
});

shiftAddModal.addEventListener('change', () => {
    setDefaultTimes(shiftAddModal.value, dateAddModal.value);
});

document.getElementById("modal__add--save-button").addEventListener("click", () => {
    saveLogic("modal__add");
});
//!SECTION - Event Listener


// document.getElementById("start_time").value = formattedStart;
// document.getElementById("end_time").value = formattedEnd;

// addButtonAddModal.addEventListener('click', () => toggleModal(addModal, addBackdrop, true));
// addBackdrop.addEventListener('click', () => toggleModal(addModal, addBackdrop, false));
// abortButtonAddModal.addEventListener('click', () => toggleModal(addModal, addBackdrop, false));
// editBackdrop.addEventListener('click', () => toggleModal(editModal, editBackdrop, false));
// abortButtonEditModal.addEventListener('click', () => toggleModal(editModal, editBackdrop, false));
// row.addEventListener('dblclick', () => openEditModal(entry));
