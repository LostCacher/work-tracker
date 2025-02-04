//SECTION - IMPORTS
import { log, loadEntryData, backupQuestion } from './helper.js';
import { loadVacationEntries } from './render.js';
import { addEntry, editEntry, deleteEntry } from './api.js';
//!SECTION - IMPORTS


//SECTION - Inizialisierung
log('Die Anwendung läuft im "Develop-Modus" -> Alle logs sind eingeschaltet:');
loadVacationEntries();

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
        loadVacationEntries(parseInt(yearSelect.value));
    });
});

//ANCHOR - Add Modal
// Click Save Button
document.getElementById("modal__add--save-button").addEventListener("click", () => {
    addEntry("modal__add");
});


//ANCHOR - Change Modal
// Open Edit Modal
document.addEventListener('dblclick', function (event) {
    if (event.target.classList.contains('calendar__entry')) {
        const entryId = event.target.getAttribute('entry__data--id');
        const modal = document.getElementById('modal__edit');
        const form = modal.querySelector('form');
        loadEntryData(entryId, modal);

        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    }
});

// Click Save Button
document.getElementById("modal__edit--save-button").addEventListener("click", (event) => {
    backupQuestion(event, 'edit', () => {
        editEntry('modal__edit');
    });
});

// Click Delete Button
document.getElementById("modal__edit--delete-button").addEventListener("click", (event) => {
    backupQuestion(event, 'delete', () => {
        deleteEntry('modal__edit');
    });
});
//!SECTION - Event Listener
