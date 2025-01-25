//SECTION -  Referenzen für Buttons und Modals
const addButtonAddModal = document.getElementById('add-work-time');
const modal = document.getElementById('work-entry-modal');
const backdrop = document.getElementById('add-modal-backdrop');
const submitButtonAddModal = document.getElementById('submit-button-add-modal');
const abortButtonAddModal = document.getElementById('abort-button-add-modal');
const editModal = document.getElementById('edit-work-entry-modal');
const editBackdrop = document.getElementById('edit-modal-backdrop');
const saveButtonEditModal = document.getElementById('save-button-edit-modal');
const deleteButtonEditModal = document.getElementById('delete-button-edit-modal');
const abortButtonEditModal = document.getElementById('abort-button-edit-modal');
let currentEntryId = null;
//!SECTION -  Referenzen für Buttons und Modals

//SECTION -  Standardzeiten für Schichten
const shiftTimes = {
    "Frühschicht": { start: "05:30", end: "13:30" },
    "Spätschicht": { start: "13:30", end: "21:30" },
    "Nachtschicht": { start: "21:30", end: "05:30" },
    "Werkstatt": { start: "05:30", end: "13:30" },
    "Berreitschaft": { start: "15:00", end: "06:00" },
    "Lehrgang": { start: "08:00", end: "16:00" }
};
//!SECTION -  Standardzeiten für Schichten

//SECTION -  Funktionen für Modals
// Modal anzeigen
addButtonAddModal.addEventListener('click', () => toggleModal(modal, backdrop, true));

// Modal schließen
backdrop.addEventListener('click', () => toggleModal(modal, backdrop, false));
abortButtonAddModal.addEventListener('click', () => toggleModal(modal, backdrop, false));
submitButtonAddModal.addEventListener('click', async () => {
    const shift = document.getElementById('shift').value;
    const start_time = document.getElementById('start_time').value;
    const end_time = document.getElementById('end_time').value;

    // Berechnung der Arbeitszeit
    const { totalHours, hoursAndMinutes } = calculateWorkingTime(start_time, end_time);

    // API-Aufruf
    try {
        const response = await fetch('/api/work_entries', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                shift,
                start_time,
                end_time,
                working_time: totalHours,
                working_time_hm: hoursAndMinutes
            })
        });

        if (response.ok) {
            toggleModal(modal, backdrop, false); // Schließt das Modal
            loadWorkEntries(); // Lädt die aktualisierte Tabelle
        } else {
            console.error('Fehler beim Hinzufügen:', await response.text());
        }
    } catch (error) {
        console.error('Fehler:', error);
    }
});

// Bearbeitungsmodal
function openEditModal(entry) {
    currentEntryId = entry.id;
    fillEditModal(entry);
    toggleModal(editModal, editBackdrop, true);
}

// Füllt die Felder im Bearbeitungs-Modal mit den Daten des Eintrags
function fillEditModal(entry) {
    document.getElementById('edit-id').textContent = entry.id;
    document.getElementById('edit-shift').value = entry.shift;
    document.getElementById('edit-start-time').value = entry.start_time;
    document.getElementById('edit-end-time').value = entry.end_time;
}

editBackdrop.addEventListener('click', () => toggleModal(editModal, editBackdrop, false));
abortButtonEditModal.addEventListener('click', () => toggleModal(editModal, editBackdrop, false));

saveButtonEditModal.addEventListener('click', () => {
    const confirmed = window.confirm("Möchten Sie die Änderungen wirklich speichern?");
    if (confirmed) {
        saveChanges(currentEntryId); // Speichert die Änderungen, wenn bestätigt
    }
});

deleteButtonEditModal.addEventListener('click', () => {
    const confirmed = window.confirm("Möchten Sie diesen Eintrag wirklich löschen?");
    if (confirmed) {
        deleteEntry(currentEntryId); // Löscht den Eintrag, wenn bestätigt
    }
});

function toggleModal(modal, backdrop, show) {
    modal.style.display = show ? 'block' : 'none';
    backdrop.style.display = show ? 'block' : 'none';
}
//!SECTION -  Funktionen für Modals

//SECTION -  Automatische Zeitvorgabe
document.getElementById('date').addEventListener('input', setDefaultTimes);

function setDefaultTimes() {
    const shift = document.getElementById("shift").value;
    const date = document.getElementById("date").value;
    const startTime = shiftTimes[shift].start;
    const isDayTomorrow = shift === "Nachtschicht" || shift === "Berreitschaft";

    const formattedStart = `${date}T${startTime}:00`;
    const formattedEnd = formatEndTime(date, shiftTimes[shift].end, isDayTomorrow);

    document.getElementById("start_time").value = formattedStart;
    document.getElementById("end_time").value = formattedEnd;
}

function formatEndTime(date, endTime, isDayTomorrow) {
    if (isDayTomorrow) {
        const startDate = new Date(`${date}T${endTime}:00`);
        startDate.setDate(startDate.getDate() + 1);
        return `${startDate.toISOString().split('T')[0]}T${endTime}:00`;
    }
    return `${date}T${endTime}:00`;
}

function calculateWorkingTime(startTime, endTime) {
    const diff = new Date(endTime) - new Date(startTime);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.round((diff % (1000 * 60 * 60)) / (1000 * 60));
    return {
        totalHours: (diff / (1000 * 60 * 60)).toFixed(2),
        hoursAndMinutes: `${hours}h ${minutes}m`
    };
}
//!SECTION -  Automatische Zeitvorgabe

//SECTION -  Einträge laden und anzeigen
async function loadWorkEntries() {
    try {
        const response = await fetch('/api/work_entries');
        if (!response.ok) throw new Error('Failed to load entries');

        const entries = await response.json();
        renderEntries(entries);
    } catch (error) {
        console.error('Error loading entries:', error);
    }
}

function renderEntries(entries) {
    const tableBody = document.getElementById('work-entries');
    tableBody.innerHTML = '';

    entries.sort((a, b) => new Date(b.end_time) - new Date(a.end_time));
    entries.forEach(entry => {
        const row = document.createElement('tr');
        row.className = getShiftClass(entry.shift);
        row.innerHTML = `
            <td style="display: none;">${entry.id}</td>
            <td id="shiftColl" class=${getShiftClass(entry.shift)}>${entry.shift}</td>
            <td>${formatDate(entry.start_time)}</td>
            <td>${formatDate(entry.end_time)}</td>
            <td>${entry.working_time.toFixed(2)} h | ${entry.working_time_hm}</td>
        `;
        row.addEventListener('dblclick', () => openEditModal(entry));
        tableBody.appendChild(row);
    });
}

function getShiftClass(shift) {
    return {
        'Frühschicht': 'frühschicht-cell',
        'Spätschicht': 'spätschicht-cell',
        'Nachtschicht': 'nachtschicht-cell',
        'Werkstatt': 'werkstatt-cell',
        'Berreitschaft': 'berreitschaft-cell',
        'Lehrgang': 'lehrgang-cell'
    }[shift] || '';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
//!SECTION -  Einträge laden und anzeigen

//SECTION -  Änderungen speichern oder löschen
async function saveChanges(id) {
    const updatedEntry = {
        id,
        shift: document.getElementById('edit-shift').value,
        start_time: document.getElementById('edit-start-time').value,
        end_time: document.getElementById('edit-end-time').value
    };

    // Berechnung der neuen Arbeitszeit
    const { totalHours, hoursAndMinutes } = calculateWorkingTime(updatedEntry.start_time, updatedEntry.end_time);
    updatedEntry.working_time = totalHours;
    updatedEntry.working_time_hm = hoursAndMinutes;

    // API-Aufruf zum Speichern der Änderungen
    try {
        const response = await fetch(`/api/work_entries/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEntry)
        });

        if (response.ok) {
            toggleModal(editModal, editBackdrop, false); // Modal schließen
            loadWorkEntries(); // Tabelle neu laden
        } else {
            console.error('Fehler beim Speichern:', await response.text());
        }
    } catch (error) {
        console.error('Fehler:', error);
    }
}

async function deleteEntry(id) {
    try {
        const response = await fetch(`/api/work_entries/${id}`, { method: 'DELETE' });

        if (response.ok) {
            toggleModal(editModal, editBackdrop, false); // Modal schließen
            loadWorkEntries(); // Tabelle neu laden
        } else {
            console.error('Fehler beim Löschen:', await response.text());
        }
    } catch (error) {
        console.error('Fehler:', error);
    }
}
//!SECTION -  Änderungen speichern oder löschen

//Initialisierung
document.addEventListener('DOMContentLoaded', loadWorkEntries);
