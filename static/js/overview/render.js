import { log, getMonthName } from './helper.js';
import { fetchAvailableYearsAndMonths, fetchAvailableYearsVacation, fetchOverviewData } from './api.js';

// SECTION - FUNCTION: loadOverviewEntries
export async function loadOverviewEntries(year = null) {
    try {
        // Abruf der verfügbaren Jahre und Monate
        const dataWork = await fetchAvailableYearsAndMonths();
        const dataVacation = await fetchAvailableYearsVacation();

        const yearFilter = document.getElementById("yearFilter");

        // Vorherige Optionen löschen
        yearFilter.innerHTML = "";

        // Kombiniere die Jahre aus beiden Abfragen
        const combinedYears = new Set([...dataWork.years, ...dataVacation.years]);

        // Jahre im Filter füllen
        combinedYears.forEach(availableYear => {
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
        if (year !== null && combinedYears.has(year.toString())) {
            // Wenn ein gültiges Jahr übergeben wurde
            yearToSelect = year.toString();
        } else {
            // Andernfalls das aktuelle oder das neueste verfügbare Jahr verwenden
            yearToSelect = combinedYears.has(currentYear.toString()) ? currentYear.toString() : Array.from(combinedYears)[0];
        }
        yearFilter.value = yearToSelect;

        // Übersichtsdaten laden
        await loadOverviewData(yearToSelect);

        // Event-Listener für den Jahr-Filter hinzufügen
        yearFilter.addEventListener("change", async () => {
            await loadOverviewData(yearFilter.value);
        });
    } catch (error) {
        log(error.message, 'error');
    }
}

// SECTION - FUNCTION: loadOverviewData
export async function loadOverviewData(year) {
    try {
        const overviewData = await fetchOverviewData(year);

        // Arbeitsstunden
        document.getElementById("totalWorkHours").textContent = `Gesamt: ${overviewData.workHoursData.total_work_hours} Stunden`;

        const workHoursPerMonthDiv = document.getElementById("workHoursPerMonth");
        workHoursPerMonthDiv.innerHTML = "";

        // Monate sortieren
        const sortedWorkHours = Object.entries(overviewData.workHoursData.work_hours_per_month).sort(([monthA], [monthB]) => parseInt(monthA, 10) - parseInt(monthB, 10));

        sortedWorkHours.forEach(([month, hours]) => {
            const monthName = getMonthName(parseInt(month, 10));
            const p = document.createElement("p");
            p.textContent = `${monthName}: ${hours} Stunden`;
            workHoursPerMonthDiv.appendChild(p);
        });

        // Urlaub
        document.getElementById("totalVacationDays").textContent = `Gesamte Urlaubstage: ${overviewData.vacationData.total_vacation_days}`;

        // Schichtstatistik
        const shiftStatsDiv = document.getElementById("shiftStats");
        shiftStatsDiv.innerHTML = "";
        Object.entries(overviewData.shiftStatsData).forEach(([shift, count]) => {
            const p = document.createElement("p");
            p.textContent = `${shift}: ${count} mal`;
            shiftStatsDiv.appendChild(p);
        });
    } catch (error) {
        log(`Fehler beim Laden der Übersichtsdaten: ${error}`, 'error');
    }
}
