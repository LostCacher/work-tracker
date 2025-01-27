//SECTION - IMPORTS
import { log, getMonthName } from './helper.js';
// import {  } from './modals.js';
// import {  } from './api.js';
//!SECTION - IMPORTS


//SECTION - Initialisierung
loadWorkEntries();
//!SECTION - Initialisierung


//SECTION - FUNCTION: loadWorkEntries
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

async function loadWorkEntries(year = null, month = null) {
    try {
        // Abruf der verfügbaren Jahre und Monate
        const response = await fetch("/api/available_years_and_months");
        if (!response.ok) throw new Error("Failed to load available years and months");

        const data = await response.json();
        const yearFilter = document.getElementById("yearFilter");
        const monthFilter = document.getElementById("monthFilter");

        // Vorherige Optionen löschen
        yearFilter.innerHTML = "";
        monthFilter.innerHTML = "";

        // Jahre im Filter füllen
        data.years.forEach(availableYear => {
            const option = document.createElement("option");
            option.value = availableYear;
            option.textContent = availableYear;
            yearFilter.appendChild(option);
        });

        // Aktuelles Jahr und Monat berechnen
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1; // Monat ist 0-indexiert
        const currentMonthFormatted = currentMonth.toString().padStart(2, '0');

        // Jahr auswählen
        let yearToSelect;
        if (year !== null && data.years.includes(year.toString())) {
            // Wenn ein gültiges Jahr übergeben wurde
            yearToSelect = year.toString();
        } else {
            // Andernfalls das aktuelle oder das neueste verfügbare Jahr verwenden
            yearToSelect = data.years.includes(currentYear.toString()) ? currentYear.toString() : data.years[0];
        }
        yearFilter.value = yearToSelect;

        // Monate für das ausgewählte Jahr füllen
        const availableMonths = data.months[yearToSelect] || [];
        availableMonths.forEach(availableMonth => {
            const monthName = getMonthName(availableMonth);
            const option = document.createElement("option");
            option.value = availableMonth;
            option.textContent = monthName;
            monthFilter.appendChild(option);
        });

        // Monat auswählen
        let monthToSelect;
        if (month !== null && availableMonths.includes(month.toString().padStart(2, '0'))) {
            // Wenn ein gültiger Monat übergeben wurde
            monthToSelect = month.toString().padStart(2, '0');
        } else {
            // Andernfalls den aktuellen oder den neuesten verfügbaren Monat verwenden
            monthToSelect = availableMonths.includes(currentMonthFormatted)
                ? currentMonthFormatted
                : availableMonths[availableMonths.length - 1];
        }
        monthFilter.value = monthToSelect;

        // Abruf der Arbeitszeiteinträge basierend auf dem ausgewählten Jahr und Monat
        const responseEntries = await fetch(`/api/work_entries?year=${yearToSelect}&month=${monthToSelect}`);
        if (!responseEntries.ok) throw new Error("Failed to load work entries");

        const workEntries = await responseEntries.json();

        // Loggen der erhaltenen Daten
        log(workEntries, 'info');

        // Hier kann die Kalenderfunktion aufgerufen werden, falls erforderlich
        // generateCalendar(yearToSelect, monthToSelect, workEntries);

    } catch (error) {
        // Fehler protokollieren
        log(error.message, 'error');
    }
}
//!SECTION - FUNCTION: loadWorkEntries



// const calendarGrid = document.getElementById('calendar-grid');
// let workEntries = [];  // Diese Arbeitseinträge werden später durch eine API oder Datenbankabfrage geladen

// // Kalender für das angegebene Jahr und Monat erstellen
// export function generateCalendar(year, month) {
//     // Leere das Kalender-Grid
//     calendarGrid.innerHTML = '';

//     // Erstelle das Datum für den ersten Tag des Monats
//     const firstDayOfMonth = new Date(year, month - 1, 1);
//     const lastDayOfMonth = new Date(year, month, 0);
//     const daysInMonth = lastDayOfMonth.getDate();

//     // Berechne die Wochentage für den ersten Tag des Monats (Montag als ersten Tag)
//     let firstDayOfWeek = firstDayOfMonth.getDay();
//     firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;  // Sonntag (0) zu Samstag (6) und verschiebt den Start der Woche auf Montag

//     // Erstelle die leeren Felder bis zum ersten Tag des Monats
//     for (let i = 0; i < firstDayOfWeek; i++) {
//         const emptyCell = document.createElement('div');
//         emptyCell.classList.add('calendar-cell');
//         calendarGrid.appendChild(emptyCell);
//     }

//     // Erstelle die Zellen für die Tage im Monat
//     for (let day = 1; day <= daysInMonth; day++) {
//         const dayCell = document.createElement('div');
//         dayCell.classList.add('calendar-cell');
//         dayCell.textContent = day;

//         // Filtere die Arbeitseinträge für diesen Tag
//         const dayEntries = workEntries.filter(entry => {
//             const entryDate = new Date(entry.date);
//             return entryDate.getDate() === day && entryDate.getMonth() === month - 1 && entryDate.getFullYear() === year;
//         });

//         // Zeige Arbeitseinträge an
//         if (dayEntries.length > 0) {
//             dayCell.classList.add('has-work-entry');
//             const entryList = document.createElement('ul');
//             dayEntries.forEach(entry => {
//                 const listItem = document.createElement('li');
//                 listItem.textContent = `${entry.shift}: ${entry.start_time} - ${entry.end_time}`;
//                 entryList.appendChild(listItem);
//             });
//             dayCell.appendChild(entryList);
//         }

//         calendarGrid.appendChild(dayCell);
//     }
// }


// Initiale Kalenderansicht anzeigen (mit aktuellem Jahr und Monat)
// const currentDate = new Date();
// generateCalendar(currentDate.getFullYear(), currentDate.getMonth() + 1);
