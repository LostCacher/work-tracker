//SECTION - IMPORTS
import { log } from './helper.js';
//!SECTION - IMPORTS

// //SECTION - Referenzen
// // Add-Modal
// const addButtonAddModal = document.getElementById('add-work-time');
// const addModal = document.getElementById('work-entry-modal');
// const addBackdrop = document.getElementById('add-modal-backdrop');
// const submitButtonAddModal = document.getElementById('submit-button-add-modal');
// const abortButtonAddModal = document.getElementById('abort-button-add-modal');

// // Edit-Modal
// const editModal = document.getElementById('edit-work-entry-modal');
// const editBackdrop = document.getElementById('edit-modal-backdrop');
// const saveButtonEditModal = document.getElementById('save-button-edit-modal');
// const deleteButtonEditModal = document.getElementById('delete-button-edit-modal');
// const abortButtonEditModal = document.getElementById('abort-button-edit-modal');
// let currentEntryId = null;
// //!SECTION - Referenzen für Buttons und Modals


// //SECTION - Automatische Zeitvorgabe
// document.getElementById('date').addEventListener('input', setDefaultTimes);

// function setDefaultTimes() {
//     const shift = document.getElementById("shift").value;
//     const date = document.getElementById("date").value;
//     const startTime = shiftTimes[shift].start;
//     const isDayTomorrow = shift === "Nachtschicht" || shift === "Berreitschaft";

//     const formattedStart = `${date}T${startTime}:00`;
//     const formattedEnd = formatEndTime(date, shiftTimes[shift].end, isDayTomorrow);

//     document.getElementById("start_time").value = formattedStart;
//     document.getElementById("end_time").value = formattedEnd;
// }

// function formatEndTime(date, endTime, isDayTomorrow) {
//     if (isDayTomorrow) {
//         const startDate = new Date(`${date}T${endTime}:00`);
//         startDate.setDate(startDate.getDate() + 1);
//         return `${startDate.toISOString().split('T')[0]}T${endTime}:00`;
//     }
//     return `${date}T${endTime}:00`;
// }

// function calculateWorkingTime(startTime, endTime) {
//     const diff = new Date(endTime) - new Date(startTime);
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const minutes = Math.round((diff % (1000 * 60 * 60)) / (1000 * 60));
//     return {
//         totalHours: (diff / (1000 * 60 * 60)).toFixed(2),
//         hoursAndMinutes: `${hours}h ${minutes}m`
//     };
// }
// //!SECTION - Automatische Zeitvorgabe

// //SECTION - Funktionen für Modals
// // Add-Modal
// addButtonAddModal.addEventListener('click', () => toggleModal(addModal, addBackdrop, true));
// addBackdrop.addEventListener('click', () => toggleModal(addModal, addBackdrop, false));
// abortButtonAddModal.addEventListener('click', () => toggleModal(addModal, addBackdrop, false));

// submitButtonAddModal.addEventListener('click', async () => {
//     const shift = document.getElementById('shift').value;
//     const start_time = document.getElementById('start_time').value;
//     const end_time = document.getElementById('end_time').value;

//     // Berechnung der Arbeitszeit
//     const { totalHours, hoursAndMinutes } = calculateWorkingTime(start_time, end_time);

//     // API-Aufruf
//     try {
//         const response = await fetch('/api/work_entries', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//                 shift,
//                 start_time,
//                 end_time,
//                 working_time: totalHours,
//                 working_time_hm: hoursAndMinutes
//             })
//         });

//         if (response.ok) {
//             toggleModal(addModal, addBackdrop, false);
//             loadWorkEntries();
//             await loadAvailableYearsAndMonths();
//         } else {
//             log(await response.text(), 'error');
//         }
//     } catch (error) {
//         log(error, 'error');
//     }
// });
// //!SECTION - Funktionen für Add-Modal


// //SECTION - Funktionen für Edit-Modal
// function openEditModal(entry) {
//     currentEntryId = entry.id;
//     fillEditModal(entry);
//     toggleModal(editModal, editBackdrop, true);
// }

// function fillEditModal(entry) {
//     document.getElementById('edit-id').textContent = entry.id;
//     document.getElementById('edit-shift').value = entry.shift;
//     document.getElementById('edit-start-time').value = entry.start_time;
//     document.getElementById('edit-end-time').value = entry.end_time;
// }

// editBackdrop.addEventListener('click', () => toggleModal(editModal, editBackdrop, false));
// abortButtonEditModal.addEventListener('click', () => toggleModal(editModal, editBackdrop, false));

// saveButtonEditModal.addEventListener('click', async () => {
//     const confirmed = window.confirm("Möchten Sie die Änderungen wirklich speichern?");
//     if (confirmed) {
//         await saveChanges(currentEntryId);
//         loadWorkEntries();
//         await loadAvailableYearsAndMonths();
//     }
// });

// deleteButtonEditModal.addEventListener('click', async () => {
//     const confirmed = window.confirm("Möchten Sie diesen Eintrag wirklich löschen?");
//     if (confirmed) {
//         await deleteEntry(currentEntryId);
//         loadWorkEntries();
//         await loadAvailableYearsAndMonths();
//     }
// });

// function toggleModal(modal, backdrop, show) {
//     modal.style.display = show ? 'block' : 'none';
//     backdrop.style.display = show ? 'block' : 'none';
// }
// //!SECTION - Funktionen für Edit-Modal
