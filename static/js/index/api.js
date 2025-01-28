//SECTION - IMPORTS
import { log, checkValidity, calculateWorkingTime, generateAlert } from './helper.js';
//!SECTION - IMPORTS

//SECTION - Save
export async function saveLogic(modalId) {
    if (!checkValidity(modalId)) {
        log("Die Eingaben sind nicht valide. Speichern wurde abgebrochen.", 'warn');
        return;
    }

    // Modal und Formular abrufen
    const modal = document.getElementById(modalId);
    const form = modal.querySelector("form");
    const formData = new FormData(form);
    const updatedEntry = Object.fromEntries(formData.entries());
    const errorID = document.getElementById('modal__add--error');

    // Arbeitszeit berechnen und hinzufügen
    const { totalHours, hoursAndMinutes } = calculateWorkingTime(
        updatedEntry.start_time,
        updatedEntry.end_time
    );
    updatedEntry.working_time = totalHours;
    updatedEntry.working_time_hm = hoursAndMinutes;

    log(`Formulardaten an API senden: ${JSON.stringify(Object.fromEntries(formData.entries()), null, 2)}`, 'log');

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

        } else {
            const errorMessage = await response.text();
            log(`Fehler beim Speichern: ${errorMessage}`, 'error');
            generateAlert(errorID, `Fehler beim Speichern`, 'danger');
        }
    } catch (error) {
        log(`Netzwerk- oder Serverfehler: ${error}`, 'error');
        generateAlert(errorID, `Netzwerk- oder Serverfehler`, 'danger');
    }
}
//!SECTION - Save


//FIXME - OLD muss noch angepasst werden

// //SECTION - Änderungen speichern oder löschen
// async function deleteEntry(id) {
//     try {
//         const response = await fetch(`/api/work_entries/${id}`, { method: 'DELETE' });
//         if (response.ok) {
//             toggleModal(editModal, editBackdrop, false);
//         } else {
//             log(await response.text(), 'error');
//         }
//     } catch (error) {
//         log(error, 'error');
//     }
// }
// //!SECTION - Änderungen speichern oder löschen
