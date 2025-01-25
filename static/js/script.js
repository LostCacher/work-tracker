// Button hinzufügen ----------------------------------------------------------------------------------------------------

// Referenzen zum Button, Modal, Hintergrund und Submit-Button
const addButtonAddModal = document.getElementById('add-work-time');
const modal = document.getElementById('work-entry-modal');
const backdrop = document.getElementById('add-modal-backdrop');
const submitButtonAddModal = document.getElementById('submit-button-add-modal');
const abortButtonAddModal = document.getElementById('abort-button-add-modal');

// Button-Klick: Modal anzeigen
addButtonAddModal.addEventListener('click', () => {
    modal.style.display = 'block';
    backdrop.style.display = 'block';
});

// Klick außerhalb des Modals: Modal schließen
backdrop.addEventListener('click', () => {
    modal.style.display = 'none';
    backdrop.style.display = 'none';
});

// Submit-Button-Klick: Modal schließen
submitButtonAddModal.addEventListener('click', () => {
    modal.style.display = 'none';
    backdrop.style.display = 'none';
});

// Abbrechen-Button: Modal schließen
abortButtonAddModal.addEventListener('click', () => {
    modal.style.display = 'none';
    backdrop.style.display = 'none';
});

// Standardzeiten für jede Schicht festlegen
const shiftTimes = {
    "Frühschicht": { start: "05:30", end: "13:30" },
    "Spätschicht": { start: "13:30", end: "21:30" },
    "Nachtschicht": { start: "21:30", end: "05:30" },
    "Werkstatt": { start: "05:30", end: "13:30" },
    "Berreitschaft": { start: "15:00", end: "06:00" },
    "Lehrgang": { start: "08:00", end: "16:00" }
};

// Datumseingabe überwachen
document.getElementById('date').addEventListener('input', setDefaultTimes);

function setDefaultTimes() {
    const shift = document.getElementById("shift").value;
    const startTime = shiftTimes[shift].start;
    let endTime = shiftTimes[shift].end;

    const date = document.getElementById("date").value;
    let formattedStart = `${date}T${startTime}:00`;

    // Für Nachtschicht: Datum des Endzeitpunktes um einen Tag erhöhen
    if (shift === "Nachtschicht" || shift === "Berreitschaft") {
        const startDate = new Date(`${date}T${startTime}:00`);
        const endDate = new Date(startDate); // Kopiere das Startdatum

        // Einen Tag hinzufügen
        endDate.setDate(startDate.getDate() + 1);

        // Neues Datum extrahieren
        const endDateString = endDate.toISOString().split("T")[0]; // Nur YYYY-MM-DD

        // Endzeit mit neuem Datum zusammenführen
        endTime = `${endDateString}T${shiftTimes[shift].end}:00`;
    } else {
        // Für andere Schichten: Datum bleibt gleich
        endTime = `${date}T${endTime}:00`;
    }

    // Setze die Werte in die entsprechenden Felder
    document.getElementById("start_time").value = formattedStart;
    document.getElementById("end_time").value = endTime;
}

// Funktion zur Berechnung der Arbeitszeit
function calculateWorkingTime(startTime, endTime) {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Berechnung der Arbeitszeitdifferenz
    const diffInMilliseconds = endDate - startDate;
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60); // Umrechnung in Stunden

    return diffInHours;
}

// Beim Laden der Seite standardmäßige Zeiten setzen, falls ein Wert gewählt ist
window.onload = setDefaultTimes;

// Submit-Funktion: Daten an den Server senden
document.getElementById("submit-button-add-modal").addEventListener("click", function () {
    const start_time = document.getElementById("start_time").value;
    const end_time = document.getElementById("end_time").value;

    // Berechne die Arbeitszeit
    const workingTime = calculateWorkingTime(start_time, end_time);

    const formData = {
        date: document.getElementById("date").value,
        shift: document.getElementById("shift").value,
        start_time: start_time,
        end_time: end_time,
        working_time: workingTime  // Arbeitszeit wird hier hinzugefügt
    };

    fetch("/api/work_entries", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    })
        .then(response => response.json())
        .then(data => {
            location.reload();  // Seite neu laden
        })
        .catch(error => {
            console.error("Fehler beim Hinzufügen des Eintrags:", error);
        });
});

// Lade SQL Daten Arbeitszeit ----------------------------------------------------------------------------------------------------
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

async function loadWorkEntries() {
    try {
        const response = await fetch('/api/work_entries', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const entries = await response.json();
            // Sortiere die Einträge nach ID absteigend
            entries.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

            const tableBody = document.getElementById('work-entries');
            tableBody.innerHTML = ''; // Bestehende Einträge löschen

            entries.forEach(entry => {
                const row = document.createElement('tr');

                // Hintergrundfarbe basierend auf der Schicht setzen
                let shiftClass = '';
                switch (entry.shift) {
                    case 'Frühschicht':
                        shiftClass = 'frühschicht-cell';
                        break;
                    case 'Spätschicht':
                        shiftClass = 'spätschicht-cell';
                        break;
                    case 'Nachtschicht':
                        shiftClass = 'nachtschicht-cell';
                        break;
                    case 'Werkstatt':
                        shiftClass = 'werkstatt-cell';
                        break;
                    case 'Berreitschaft':
                        shiftClass = 'berreitschaft-cell';
                        break;
                    case 'Lehrgang':
                        shiftClass = 'lehrgang-cell';
                        break;
                }

                row.innerHTML = `
    <td style="display: none;">${entry.id}</td>
    <td id="shiftColl" class="${shiftClass}">${entry.shift}</td>
    <td>${formatDate(entry.start_time)}</td>
    <td>${formatDate(entry.end_time)}</td>
    <td>${entry.working_time.toFixed(2)} h</td>
`;

                // Event für Doppelklick hinzufügen
                row.addEventListener('dblclick', () => {
                    openEditModal(entry);
                });

                tableBody.appendChild(row);
            });
        } else {
            console.error('Failed to load entries:', response.statusText);
        }
    } catch (error) {
        console.error('Error loading entries:', error);
    }
}


// Referenzen zum Modal, Hintergrund, Speichern- und Löschen-Button
const editModal = document.getElementById('edit-work-entry-modal');
const editBackdrop = document.getElementById('edit-modal-backdrop');
const saveButtonEditModal = document.getElementById('save-button-edit-modal');
const deleteButtonEditModal = document.getElementById('delete-button-edit-modal');
const abortButtonEditModal = document.getElementById('abort-button-edit-modal');

// Modal zum Bearbeiten öffnen
function openEditModal(entry) {
    editModal.style.display = 'block';
    editBackdrop.style.display = 'block';

    // Klick außerhalb des Modals: Modal schließen
    editBackdrop.addEventListener('click', () => {
        editModal.style.display = 'none';
        editBackdrop.style.display = 'none';
    });

    // Abbrechen-Button: Modal schließen
    abortButtonEditModal.addEventListener('click', () => {
        editModal.style.display = 'none';
        editBackdrop.style.display = 'none';
    });

    // Fülle das Modal mit den aktuellen Daten
    document.getElementById('edit-id').textContent = entry.id;
    document.getElementById('edit-date').value = entry.date;
    document.getElementById('edit-shift').value = entry.shift;
    document.getElementById('edit-start-time').value = entry.start_time;
    document.getElementById('edit-end-time').value = entry.end_time;

    // Event für Speichern
    saveButtonEditModal.onclick = () => saveChanges(entry.id);

    // Event für Löschen
    deleteButtonEditModal.onclick = () => deleteEntry(entry.id);
}

// Änderungen speichern
async function saveChanges(id) {
    const updatedEntry = {
        id: id,
        shift: document.getElementById('edit-shift').value,
        start_time: document.getElementById('edit-start-time').value,
        end_time: document.getElementById('edit-end-time').value
    };

    try {
        const response = await fetch(`/api/work_entries/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedEntry),
        });

        if (response.ok) {
            alert('Änderungen erfolgreich gespeichert!');
            editModal.style.display = 'none';
            editBackdrop.style.display = 'none';
            loadWorkEntries(); // Tabelle neu laden
        } else {
            console.error('Fehler beim Speichern der Änderungen:', response.statusText);
        }
    } catch (error) {
        console.error('Fehler beim Speichern der Änderungen:', error);
    }
}

// Eintrag löschen
async function deleteEntry(id) {
    try {
        const response = await fetch(`/api/work_entries/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Eintrag erfolgreich gelöscht!');
            loadWorkEntries(); // Tabelle neu laden
        } else {
            console.error('Fehler beim Löschen des Eintrags:', response.statusText);
        }
    } catch (error) {
        console.error('Fehler beim Löschen des Eintrags:', error);
    }
}

// Beim Laden der Seite die Arbeitseinträge anzeigen
document.addEventListener('DOMContentLoaded', loadWorkEntries);
