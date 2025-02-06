import { log } from './helper.js';

// SECTION - FUNCTION: fetchAvailableYearsAndMonths
export async function fetchAvailableYearsAndMonths() {
    try {
        const response = await fetch("/api/available_years_and_months");
        if (!response.ok) throw new Error("Failed to load available years and months");
        return await response.json();
    } catch (error) {
        log(`Fehler beim Laden der verfügbaren Jahre und Monate: ${error}`, 'error');
        throw error;
    }
}

// SECTION - FUNCTION: fetchAvailableYearsVacation
export async function fetchAvailableYearsVacation() {
    try {
        const response = await fetch("/api/available_years_vacation");
        if (!response.ok) throw new Error("Failed to load available vacation years");
        return await response.json();
    } catch (error) {
        log(`Fehler beim Laden der verfügbaren Urlaubsjahre: ${error}`, 'error');
        throw error;
    }
}

// SECTION - FUNCTION: fetchOverviewData
export async function fetchOverviewData(year) {
    try {
        const responseWorkHours = await fetch(`/api/overview/work_hours?year=${year}`);
        if (!responseWorkHours.ok) throw new Error("Failed to load work hours");

        const workHoursData = await responseWorkHours.json();

        const responseVacation = await fetch(`/api/overview/vacation?year=${year}`);
        if (!responseVacation.ok) throw new Error("Failed to load vacation data");

        const vacationData = await responseVacation.json();

        const responseShifts = await fetch(`/api/overview/shifts?year=${year}`);
        if (!responseShifts.ok) throw new Error("Failed to load shift stats");

        const shiftStatsData = await responseShifts.json();

        return { workHoursData, vacationData, shiftStatsData };
    } catch (error) {
        log(`Fehler beim Laden der Übersichtsdaten: ${error}`, 'error');
        throw error;
    }
}
