// Button hinzufügen ----------------------------------------------------------------------------------------------------

// Referenzen zum Button, Modal, Hintergrund und Submit-Button
const addButton = document.getElementById('add-work-time');
const modal = document.getElementById('work-entry-modal');
const backdrop = document.getElementById('modal-backdrop');
const submitButton = document.getElementById('submit-button');

// Button-Klick: Modal anzeigen
addButton.addEventListener('click', () => {
    modal.style.display = 'block';
    backdrop.style.display = 'block';
});

// Klick außerhalb des Modals: Modal schließen
backdrop.addEventListener('click', () => {
    modal.style.display = 'none';
    backdrop.style.display = 'none';
});

// Submit-Button-Klick: Modal schließen
submitButton.addEventListener('click', () => {
    // Hier könntest du auch noch eine Überprüfung oder Speicherung einfügen
    modal.style.display = 'none';
    backdrop.style.display = 'none';
});

// Standardzeiten für jede Schicht festlegen
const shiftTimes = {
    "Frühschicht": { start: "05:30", end: "13:30" },
    "Spätschicht": { start: "13:30", end: "21:30" },
    "Nachtschicht": { start: "21:30", end: "05:30" },
    "Werkstatt": { start: "05:30", end: "13:30" },
    "Berreitschaft": { start: "00:00", end: "00:00" },
    "Lehrgang": { start: "08:00", end: "16:00" }
};

function setDefaultTimes() {
    const shift = document.getElementById("shift").value;
    const startTime = shiftTimes[shift].start;
    let endTime = shiftTimes[shift].end;

    const date = document.getElementById("date").value;
    let formattedStart = `${date}T${startTime}:00`;

    // Für Nachtschicht: Datum des Endzeitpunktes um einen Tag erhöhen
    if (shift === "Nachtschicht") {
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
document.getElementById("submit-button").addEventListener("click", function () {
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
            alert(data.message);  // Zeigt die Erfolgsnachricht an
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
            const tableBody = document.getElementById('work-entries');
            tableBody.innerHTML = ''; // Bestehende Einträge löschen

            entries.forEach(entry => {
                const row = document.createElement('tr');

                // Hintergrundfarbe basierend auf der Schicht setzen
                let shiftClass = '';
                switch (entry.shift) {
                    case 'Frühschicht':
                        shiftClass = 'table-success';
                        break;
                    case 'Spätschicht':
                        shiftClass = 'table-warning';
                        break;
                    case 'Nachtschicht':
                        shiftClass = 'table-danger';
                        break;
                    case 'Werkstatt':
                        shiftClass = 'table-info';
                        break;
                    case 'Berreitschaft':
                        shiftClass = 'table-secondary';
                        break;
                    case 'Lehrgang':
                        shiftClass = 'table-primary';
                        break;
                    default:
                        shiftClass = 'table-light';
                        break;
                }

                row.classList.add(shiftClass); // CSS-Klasse anwenden

                row.innerHTML = `
    <td>${entry.id}</td>
    <td>${formatDate(entry.start_time)}</td>
    <td>${formatDate(entry.end_time)}</td>
    <td>${entry.shift}</td>
    <td>${entry.working_time.toFixed(2)} h</td>
`;

                tableBody.appendChild(row);
            });
        } else {
            console.error('Failed to load entries:', response.statusText);
        }
    } catch (error) {
        console.error('Error loading entries:', error);
    }
}

// Lade Einträge beim Laden der Seite
document.addEventListener('DOMContentLoaded', loadWorkEntries);
// Lade SQL Daten Arbeitszeit (ende) ----------------------------------------------------------------------------------------------------
