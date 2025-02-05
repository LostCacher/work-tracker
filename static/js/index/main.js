//SECTION - IMPORTS
import { log, setDefaultTimes, loadEntryData, backupQuestion } from './helper.js';
import { loadWorkEntries } from './render.js';
import { addEntry, editEntry, deleteEntry } from './api.js';
//!SECTION - IMPORTS


//SECTION - Inizialisierung
log('Die Anwendung läuft im "Develop-Modus" -> Alle logs sind eingeschaltet:');
loadWorkEntries();

// Tooltips initialisieren
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(tooltipTriggerEl => {
    new bootstrap.Tooltip(tooltipTriggerEl);
});
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

// Add Date
dateAddModal.addEventListener('input', () => {
    setDefaultTimes(shiftAddModal.value, dateAddModal.value);
});

// Add Shift
shiftAddModal.addEventListener('change', () => {
    setDefaultTimes(shiftAddModal.value, dateAddModal.value);
});

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
