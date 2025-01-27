//SECTION - IMPORTS
import { log, getMonthName, getShiftClass } from './helper.js';
// import {  } from './modals.js';
// import {  } from './api.js';
//!SECTION - IMPORTS


//SECTION - FUNCTION: loadWorkEntries
loadWorkEntries(); // Inizialisierung
let work_entries = [];

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

        work_entries = await responseEntries.json();

        generateCalendar(yearToSelect, monthToSelect)

    } catch (error) {
        // Fehler protokollieren
        log(error.message, 'error');
    }
}
//!SECTION - FUNCTION: loadWorkEntries


//SECTION - FUNCTION: Generate Calendar
function generateCalendar(year, month) {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = ''; // Kalender-Grid leeren

    // Erstelle das Datum für den ersten Tag des Monats
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Berechne die Wochentage für den ersten Tag des Monats
    let firstDayOfWeek = firstDayOfMonth.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Montag als erster Wochentag

    // Leere Felder für die Tage vor dem Monatsanfang
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-cell');
        calendarGrid.appendChild(emptyCell);
    }

    // Tage im Monat erzeugen
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-cell');
        dayCell.textContent = day;

        // Arbeitseinträge für diesen Tag filtern
        const dayEntries = work_entries.filter(entry => {
            const entryDate = new Date(entry.start_time);
            return entryDate.getDate() === day && entryDate.getMonth() === month - 1 && entryDate.getFullYear() === parseInt(year, 10);
        });


        // Arbeitseinträge anzeigen
        if (dayEntries.length > 0) {
            // Zuerst die allgemeine Klasse für Arbeitseinträge hinzufügen
            dayCell.classList.add('has-work-entry');

            // Die Klasse für den Shift hinzufügen (für den Tag selbst)
            dayEntries.forEach(entry => {
                dayCell.classList.add(getShiftClass(entry.shift));
            });

            const entryList = document.createElement('ul');

            dayEntries.forEach(entry => {
                const listItem = document.createElement('li');
                listItem.textContent = `${entry.shift}: ${entry.working_time}h | ${entry.working_time_hm}`;
                entryList.appendChild(listItem);
            });

            dayCell.appendChild(entryList);
        }

        calendarGrid.appendChild(dayCell);
    }
}
//!SECTION - FUNCTION: Generate Calendar
