//SECTION - IMPORTS
import { log, checkValidity, calculateWorkingTime, generateAlert, extractYearAndMonth } from './helper.js';
import { loadWorkEntries } from './render.js';
//!SECTION - IMPORTS

//SECTION - Add Entry
export async function addEntry(modalId) {
    if (!checkValidity(modalId)) {
        log("Die Eingaben sind nicht valide. Hinzufügen wurde abgebrochen.", 'warn');
        return;
    }

    // Modal und Formular abrufen
    const modal = document.getElementById(modalId);
    const form = modal.querySelector("form");
    const formData = new FormData(form);
    const newEntry = Object.fromEntries(formData.entries());
    const errorID = document.getElementById(`${modalId}--error`);

    // Arbeitszeit berechnen und hinzufügen
    const { totalHours, hoursAndMinutes } = calculateWorkingTime(
        newEntry.start_time,
        newEntry.end_time
    );
    newEntry.working_time = totalHours;
    newEntry.working_time_hm = hoursAndMinutes;

    log(`Formulardaten an API senden (Add): ${JSON.stringify(newEntry, null, 2)}`, 'log');

    // Daten an die API senden
    try {
        const response = await fetch(`/api/work_entries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newEntry),
        });

        if (response.ok) {
            log(`Eintrag erfolgreich hinzugefügt.`, 'info');

            // Modal schließen
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

            // Jahr und Monat aus start_time extrahieren und loadWorkEntries aufrufen
            const { year, month } = extractYearAndMonth(newEntry.start_time);
            loadWorkEntries(year, month);

        } else {
            const errorMessage = await response.text();
            log(`Fehler beim Hinzufügen: ${errorMessage}`, 'error');
            generateAlert(errorID, `Fehler beim Hinzufügen`, 'danger');
        }
    } catch (error) {
        log(`Netzwerk- oder Serverfehler: ${error}`, 'error');
        generateAlert(errorID, `Netzwerk- oder Serverfehler`, 'danger');
    }
}
//!SECTION - Add Entry

//SECTION - Edit Entry
export async function editEntry(modalId) {
    if (!checkValidity(modalId)) {
        log("Die Eingaben sind nicht valide. Speichern wurde abgebrochen.", 'warn');
        return;
    }

    // Modal und Formular abrufen
    const modal = document.getElementById(modalId);
    const form = modal.querySelector("form");
    const formData = new FormData(form);
    const updatedEntry = Object.fromEntries(formData.entries());
    const errorID = document.getElementById(`${modalId}--error`);

    // Arbeitszeit berechnen und hinzufügen
    const { totalHours, hoursAndMinutes } = calculateWorkingTime(
        updatedEntry.start_time,
        updatedEntry.end_time
    );
    updatedEntry.working_time = totalHours;
    updatedEntry.working_time_hm = hoursAndMinutes;

    log(`Formulardaten an API senden (Edit): ${JSON.stringify(updatedEntry, null, 2)}`, 'log');

    // Daten an die API senden
    try {
        const response = await fetch(`/api/work_entries/${updatedEntry.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedEntry),
        });

        if (response.ok) {
            log(`Eintrag mit ID ${updatedEntry.id} erfolgreich gespeichert.`, 'info');

            // Modal schließen
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

            // Jahr und Monat aus start_time extrahieren und loadWorkEntries aufrufen
            const { year, month } = extractYearAndMonth(updatedEntry.start_time);
            loadWorkEntries(year, month);

        } else {
            const errorMessage = await response.text();
            log(`Fehler beim Ändern: ${errorMessage}`, 'error');
            generateAlert(errorID, `Fehler beim Ändern`, 'danger');
        }
    } catch (error) {
        log(`Netzwerk- oder Serverfehler: ${error}`, 'error');
        generateAlert(errorID, `Netzwerk- oder Serverfehler`, 'danger');
    }
}
//!SECTION - Edit Entry

//SECTION - Delete Entry
export async function deleteEntry(modalId) {
    if (!checkValidity(modalId)) {
        log("Die Eingaben sind nicht valide. Löschen wurde abgebrochen.", 'warn');
        return;
    }

    // Modal und Formular abrufen
    const modal = document.getElementById(modalId);
    const form = modal.querySelector("form");
    const formData = new FormData(form);
    const updatedEntry = Object.fromEntries(formData.entries());
    const errorID = document.getElementById(`${modalId}--error`);

    log(`Formulardaten an API senden (Delete): ${JSON.stringify(updatedEntry, null, 2)}`, 'log');

    // Daten an die API senden
    try {
        const response = await fetch(`/api/work_entries/${updatedEntry.id}`, { method: 'DELETE' });
        if (response.ok) {
            log(`Eintrag mit ID ${updatedEntry.id} erfolgreich gelöscht.`, 'info');

            // Modal schließen
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

            // Jahr und Monat aus start_time extrahieren und loadWorkEntries aufrufen
            const { year, month } = extractYearAndMonth(updatedEntry.start_time);
            loadWorkEntries(year, month);

        } else {
            const errorMessage = await response.text();
            log(`Fehler beim Löschen: ${errorMessage}`, 'error');
            generateAlert(errorID, `Fehler beim Löschen`, 'danger');
        }
    } catch (error) {
        log(`Netzwerk- oder Serverfehler: ${error}`, 'error');
        generateAlert(errorID, `Netzwerk- oder Serverfehler`, 'danger');
    }
}
//!SECTION - Delete Entry


//SECTION - Auto Logout
let logoutTimer;

function resetLogoutTimer() {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
        window.location.href = logoutUrl; // Verwende die übergebene URL
    }, 1800000); // 30 Minuten in Millisekunden 1800000
}

document.onload = resetLogoutTimer;
document.onmousemove = resetLogoutTimer;
document.onclick = resetLogoutTimer;
document.onscroll = resetLogoutTimer;
//!SECTION - Auto Logout
