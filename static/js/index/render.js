//SECTION - IMPORTS
import { log, getMonthName, getShiftClass } from './helper.js';
//!SECTION - IMPORTS

let work_entries = [];

export async function loadWorkEntries(year = null, month = null) {
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
        work_entries.sort((a, b) => new Date(a.end_time) - new Date(b.end_time));

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

    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    let firstDayOfWeek = firstDayOfMonth.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; // Montag als erster Wochentag

    // Leere Felder für die Tage vor dem Monatsanfang
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar__cell');
        calendarGrid.appendChild(emptyCell);
    }

    // Tage im Monat erzeugen
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar__cell');
        dayCell.textContent = day;

        // Arbeitseinträge für diesen Tag filtern
        const dayEntries = work_entries.filter(entry => {
            const entryDate = new Date(entry.start_time);
            return entryDate.getDate() === day && entryDate.getMonth() === month - 1 && entryDate.getFullYear() === parseInt(year, 10);
        });

        // Arbeitseinträge anzeigen
        if (dayEntries.length > 0) {
            dayEntries.forEach(entry => {
                const entryDiv = document.createElement('div');
                entryDiv.classList.add('calendar__entry');
                entryDiv.classList.add(getShiftClass(entry.shift)); // Dynamische Shift-Klasse hinzufügen

                // Text für Schicht und Arbeitszeit
                entryDiv.innerHTML = `
                    <span>${entry.shift} (${entry.working_time_hm})</span>
                `;

                dayCell.appendChild(entryDiv);
            });
        }

        calendarGrid.appendChild(dayCell);
    }
}
//!SECTION - FUNCTION: Generate Calendar
