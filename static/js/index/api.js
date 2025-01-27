//SECTION - IMPORTS
import { log, getMonthName } from './helper.js';
//!SECTION - IMPORTS




//FIXME - OLD muss noch angepasst werden
// //SECTION - Einträge laden und anzeigen
// function renderEntries(entries) {
//     const tableBody = document.getElementById('work-entries');
//     tableBody.innerHTML = '';

//     entries.sort((a, b) => new Date(b.end_time) - new Date(a.end_time));
//     entries.forEach(entry => {
//         const row = document.createElement('tr');
//         row.className = getShiftClass(entry.shift);
//         row.innerHTML = `
//             <td style="display: none;">${entry.id}</td>
//             <td class="shiftColl ${getShiftClass(entry.shift)}">${entry.shift}</td>
//             <td>${formatDate(entry.start_time)}</td>
//             <td>${formatDate(entry.end_time)}</td>
//             <td>${entry.working_time.toFixed(2)} h | ${entry.working_time_hm}</td>
//         `;
//         row.addEventListener('dblclick', () => openEditModal(entry));
//         tableBody.appendChild(row);
//     });
// }

// function formatDate(dateString) {
//     const date = new Date(dateString);
//     return date.toLocaleString('de-DE', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//     });
// }
// //!SECTION - Einträge laden und anzeigen

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

// //SECTION - Tabellenfilter Arbeitseintäge
// const yearFilter = document.getElementById("yearFilter");
// const monthFilter = document.getElementById("monthFilter");

// function applyFilter() {
//     const selectedYear = yearFilter.value;
//     const selectedMonth = monthFilter.value;
//     loadWorkEntries(selectedYear, selectedMonth);
// }

// // Event-Listener für die Dropdowns
// yearFilter.addEventListener("change", () => {
//     updateMonthsForSelectedYear();
//     applyFilter();
// });

// monthFilter.addEventListener("change", applyFilter);

// function updateMonthsForSelectedYear() {
//     const selectedYear = yearFilter.value;

//     // Abrufen der verfügbaren Monate für das ausgewählte Jahr
//     fetch("/api/available_years_and_months")
//         .then((response) => response.json())
//         .then((data) => {
//             const availableMonths = data.months[selectedYear] || [];
//             const getMonthName = (month) => {
//                 const monthNames = [
//                     "Januar", "Februar", "März", "April", "Mai", "Juni",
//                     "Juli", "August", "September", "Oktober", "November", "Dezember"
//                 ];
//                 return monthNames[month - 1];
//             };

//             // Aktualisieren des Monats-Dropdowns
//             monthFilter.innerHTML = "";
//             availableMonths.forEach((month) => {
//                 const monthName = getMonthName(month);
//                 const option = document.createElement("option");
//                 option.value = month;
//                 option.textContent = monthName;
//                 monthFilter.appendChild(option);
//             });

//             // Wähle den ersten verfügbaren Monat aus
//             if (availableMonths.length > 0) {
//                 monthFilter.value = availableMonths[0];
//             }

//             // Aktualisiere die Work-Entries basierend auf Jahr und Monat
//             applyFilter();
//         })
//         .catch((error) => {
//             log(error, 'error');
//         });
// }
// //!SECTION - Tabellenfilter Arbeitseintäge
