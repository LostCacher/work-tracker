//SECTION - IMPORTS
import { log } from './helper.js';
import { loadWorkEntries } from './render.js';
// import {  } from './modals.js';
// import {  } from './api.js';
//!SECTION - IMPORTS


//SECTION - Inizialisierung
log('Die Anwendung läuft im "Develop-Modus" -> Alle logs sind eingeschaltet:');
loadWorkEntries();
//!SECTION - Inizialisierung


//SECTION - Event Listener

//SECTION - Filter Change
const yearSelect = document.getElementById('yearFilter');
const monthSelect = document.getElementById('monthFilter');

[yearSelect, monthSelect].forEach(select => {
    select.addEventListener('change', function () {
        loadWorkEntries(parseInt(yearSelect.value), parseInt(monthSelect.value));
    });
});
//!SECTION - Filter Change


// addButtonAddModal.addEventListener('click', () => toggleModal(addModal, addBackdrop, true));
// addBackdrop.addEventListener('click', () => toggleModal(addModal, addBackdrop, false));
// abortButtonAddModal.addEventListener('click', () => toggleModal(addModal, addBackdrop, false));
// editBackdrop.addEventListener('click', () => toggleModal(editModal, editBackdrop, false));
// abortButtonEditModal.addEventListener('click', () => toggleModal(editModal, editBackdrop, false));
// row.addEventListener('dblclick', () => openEditModal(entry));
//!SECTION - Event Listener
