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
            location.reload();
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
    location.reload();
});

deleteButtonEditModal.addEventListener('click', () => {
    const confirmed = window.confirm("Möchten Sie diesen Eintrag wirklich löschen?");
    if (confirmed) {
        deleteEntry(currentEntryId); // Löscht den Eintrag, wenn bestätigt
    }
    location.reload();
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
async function loadAvailableYearsAndMonths() {
    try {
        const response = await fetch("/api/available_years_and_months");
        if (!response.ok) throw new Error("Failed to load available years and months");

        const data = await response.json();
        const yearFilter = document.getElementById("yearFilter");
        const monthFilter = document.getElementById("monthFilter");

        // Dropdown für Jahre leeren und nur verfügbare Jahre hinzufügen
        yearFilter.innerHTML = "";
        data.years.forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });

        // Funktion zum Abrufen des Monatsnamens
        const getMonthName = (month) => {
            const monthNames = [
                "Januar", "Februar", "März", "April", "Mai", "Juni",
                "Juli", "August", "September", "Oktober", "November", "Dezember"
            ];
            return monthNames[month - 1];  // Monat ist 1-basiert, daher -1
        };

        // Überprüfen, ob es Jahre gibt und das Standardjahr setzen
        const selectedYear = yearFilter.value || data.years[0];
        yearFilter.value = selectedYear;

        // Dropdown für Monate leeren und nur verfügbare Monate für das ausgewählte Jahr hinzufügen
        monthFilter.innerHTML = "";
        const availableMonths = data.months[selectedYear] || [];
        availableMonths.forEach(month => {
            const monthName = getMonthName(month); // Monatsnamen direkt hier erhalten
            const option = document.createElement("option");
            option.value = month;
            option.textContent = monthName;
            monthFilter.appendChild(option);
        });

        // Setze den Standardmonat auf den ersten verfügbaren Monat
        const selectedMonth = monthFilter.value || availableMonths[0];
        monthFilter.value = selectedMonth;

        // Lade die WorkEntries mit dem Standardjahr und -monat
        loadWorkEntries(selectedYear, selectedMonth);

    } catch (error) {
        console.error("Error loading available years and months:", error);
    }
}

// Lade die WorkEntries basierend auf Jahr und Monat
async function loadWorkEntries(year = null, month = null) {
    // Hole das aktuelle Jahr und den aktuellen Monat, falls nicht gesetzt
    const currentDate = new Date();
    const filterYear = year || currentDate.getFullYear();
    const filterMonth = month || currentDate.getMonth() + 1;

    try {
        const response = await fetch(`/api/work_entries?year=${filterYear}&month=${filterMonth}`);
        if (!response.ok) throw new Error("Failed to load entries");

        const entries = await response.json();
        renderEntries(entries);

        // Filterwerte in die Dropdowns eintragen
        document.getElementById("yearFilter").value = filterYear;
        document.getElementById("monthFilter").value = filterMonth;
    } catch (error) {
        console.error("Error loading entries:", error);
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
            <td class="shiftColl ${getShiftClass(entry.shift)}">${entry.shift}</td>
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

//SECTION - Tabellenfilter Arbeitseintäge
const yearFilter = document.getElementById("yearFilter");
const monthFilter = document.getElementById("monthFilter");

function applyFilter() {
    const selectedYear = yearFilter.value;
    const selectedMonth = monthFilter.value;
    loadWorkEntries(selectedYear, selectedMonth);
}

// Event-Listener für die Dropdowns
yearFilter.addEventListener("change", () => {
    updateMonthsForSelectedYear();
    applyFilter();
});

monthFilter.addEventListener("change", applyFilter);

function updateMonthsForSelectedYear() {
    const selectedYear = yearFilter.value;

    // Abrufen der verfügbaren Monate für das ausgewählte Jahr
    fetch("/api/available_years_and_months")
        .then((response) => response.json())
        .then((data) => {
            const availableMonths = data.months[selectedYear] || [];
            const getMonthName = (month) => {
                const monthNames = [
                    "Januar", "Februar", "März", "April", "Mai", "Juni",
                    "Juli", "August", "September", "Oktober", "November", "Dezember"
                ];
                return monthNames[month - 1];
            };

            // Aktualisieren des Monats-Dropdowns
            monthFilter.innerHTML = "";
            availableMonths.forEach((month) => {
                const monthName = getMonthName(month);
                const option = document.createElement("option");
                option.value = month;
                option.textContent = monthName;
                monthFilter.appendChild(option);
            });

            // Wähle den ersten verfügbaren Monat aus
            if (availableMonths.length > 0) {
                monthFilter.value = availableMonths[0];
            }

            // Aktualisiere die Work-Entries basierend auf Jahr und Monat
            applyFilter();
        })
        .catch((error) => {
            console.error("Fehler beim Aktualisieren der Monate:", error);
        });
}
//!SECTION - Tabellenfilter Arbeitseintäge

//Initialisierung
document.addEventListener("DOMContentLoaded", () => {
    loadAvailableYearsAndMonths();
    loadWorkEntries();
});
