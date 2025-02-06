//SECTION - IMPORTS
import { log, getMonthName, getWeekNumber } from './helper.js';
//!SECTION - IMPORTS

let vacation_entries = [];

// SECTION - FUNCTION: loadVacationEntries
export async function loadVacationEntries(year = null) {
    try {
        // Abruf der verfügbaren Jahre und Monate
        const response = await fetch("/api/available_years_vacation");
        if (!response.ok) throw new Error("Failed to load available years");

        const data = await response.json();
        const yearFilter = document.getElementById("yearFilter");

        // Vorherige Optionen löschen
        yearFilter.innerHTML = "";

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

        // Abruf der Urlaubseinträge basierend auf dem ausgewählten Jahr
        const responseEntries = await fetch(`/api/vacation_entries?year=${yearToSelect}`);
        if (!responseEntries.ok) throw new Error("Failed to load vacation entries");

        vacation_entries = await responseEntries.json();
        vacation_entries.sort((a, b) => new Date(a.vacation_date) - new Date(b.vacation_date));

        generateCalendar(yearToSelect, vacation_entries)

    } catch (error) {
        // Fehler protokollieren
        log(error.message, 'error');
    }
}
// !SECTION - FUNCTION: loadVacationEntries


//SECTION - FUNCTION: generateCalendar
function generateCalendar(year, vacation_entries) {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = ''; // Kalender-Grid leeren

    // Header-Zeile mit "Monat", "KW" und Wochentagen
    const headerRow = document.createElement('div');
    headerRow.classList.add('calendar__row', 'calendar__header', 'user-select-none');

    ['Monat', 'KW', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'].forEach(title => {
        const headerCell = document.createElement('div');
        headerCell.classList.add('calendar__cell', 'calendar__header-cell', 'user-select-none');
        headerCell.textContent = title;
        headerRow.appendChild(headerCell);
    });

    calendarGrid.appendChild(headerRow);

    // Urlaubseinträge nach Wochen gruppieren, nur für das übergebene Jahr
    const weeks = {};
    vacation_entries.forEach(entry => {
        const entryDate = new Date(entry.vacation_date);
        if (entryDate.getFullYear() !== parseInt(year, 10)) return;

        const weekNumber = getWeekNumber(entryDate);
        const monthName = getMonthName(entryDate.getMonth() + 1);
        const dayNumber = entryDate.getDate(); // Tagesnummer extrahieren
        const key = `${year}-KW${weekNumber}`;

        if (!weeks[key]) {
            weeks[key] = { month: monthName, weekNumber, days: {} };
        }

        const dayName = entryDate.toLocaleDateString('de-DE', { weekday: 'long' });
        weeks[key].days[dayName] = weeks[key].days[dayName] || [];
        weeks[key].days[dayName].push({ ...entry, dayNumber }); // Tagesnummer speichern
    });

    // Kalender basierend auf relevanten Wochen generieren
    Object.values(weeks).forEach(({ month, weekNumber, days }) => {
        const weekRow = document.createElement('div');
        weekRow.classList.add('calendar__row');

        // Monatsspalte
        const monthCell = document.createElement('div');
        monthCell.classList.add('calendar__cell', 'calendar__month-cell', 'user-select-none');
        monthCell.textContent = month;
        weekRow.appendChild(monthCell);

        // KW-Spalte
        const weekCell = document.createElement('div');
        weekCell.classList.add('calendar__cell', 'calendar__week-cell', 'user-select-none');
        weekCell.textContent = `KW ${weekNumber}`;
        weekRow.appendChild(weekCell);

        // Wochentage anzeigen
        ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'].forEach(day => {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar__cell', 'calendar__day-cell');

            let dayContent = '';

            if (days[day]) {
                days[day].forEach(entry => {
                    if (!dayContent) {
                        dayContent = document.createElement('div');
                        dayContent.classList.add('calendar__day-number', 'user-select-none');
                        dayContent.textContent = entry.dayNumber; // Tagesnummer anzeigen
                        dayCell.appendChild(dayContent);
                        dayCell.setAttribute('entry__data--id', entry.id);
                    }

                    const weekDayForPhone = document.createElement('div');
                    weekDayForPhone.classList.add('calendar__day-with-weekday');
                    weekDayForPhone.textContent = day;
                    dayCell.appendChild(weekDayForPhone);

                    const entryDiv = document.createElement('div');
                    entryDiv.classList.add('calendar__entry', 'user-select-none');
                    entryDiv.textContent = `Urlaub`;
                    entryDiv.setAttribute('entry__data--id', entry.id);
                    dayCell.appendChild(entryDiv);
                });
            } else {
                dayCell.classList.add('calendar__cell--empty', 'user-select-none');
                const dayNumberDiv = document.createElement('div');
                dayNumberDiv.classList.add('calendar__day-number', 'user-select-none');
                dayCell.appendChild(dayNumberDiv);
            }

            weekRow.appendChild(dayCell);
        });

        calendarGrid.appendChild(weekRow);
    });
}
//!SECTION - FUNCTION: generateCalendar
