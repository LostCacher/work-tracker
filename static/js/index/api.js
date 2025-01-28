//SECTION - IMPORTS
import { log, getMonthName } from './helper.js';
//!SECTION - IMPORTS




//FIXME - OLD muss noch angepasst werden

// //SECTION - Änderungen speichern oder löschen
// async function saveChanges(id) {
//     const updatedEntry = {
//         id,
//         shift: document.getElementById('edit-shift').value,
//         start_time: document.getElementById('edit-start-time').value,
//         end_time: document.getElementById('edit-end-time').value
//     };

//     const { totalHours, hoursAndMinutes } = calculateWorkingTime(updatedEntry.start_time, updatedEntry.end_time);
//     updatedEntry.working_time = totalHours;
//     updatedEntry.working_time_hm = hoursAndMinutes;

//     try {
//         const response = await fetch(`/api/work_entries/${id}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(updatedEntry)
//         });

//         if (response.ok) {
//             toggleModal(editModal, editBackdrop, false);
//         } else {
//             log(await response.text(), 'error');
//         }
//     } catch (error) {
//         log(error, 'error');
//     }
// }

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
