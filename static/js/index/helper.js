//SECTION - Log-Funktion
const isDebugMode = true; //ANCHOR - true (logs aktive / false logs deaktiviert)
let hasLoggedProductionMessage = false;

export function log(message, level = 'info') {
    // Überprüfen, ob Debug-Modus aktiviert ist
    if (typeof isDebugMode !== 'undefined' && isDebugMode) {
        console[level](message);
    } else {
        // Debugging ist deaktiviert und die Nachricht wurde noch nicht ausgegeben
        if (!hasLoggedProductionMessage) {
            console.info('Die Anwendung läuft im "Produktions-Modus" -> Alle logs sind ausgeschaltet !!!');
            hasLoggedProductionMessage = true;  // Nachricht nur einmal ausgeben
        }
    }
}
//!SECTION - Log-Funktion


//SECTION - Monatsname
export function getMonthName(month) {
    const monthNames = [
        "Januar", "Februar", "März", "April", "Mai", "Juni",
        "Juli", "August", "September", "Oktober", "November", "Dezember"
    ];
    return monthNames[month - 1];
};
//!SECTION - Monatsname

//SECTION - Schicht Classe for background
export function getShiftClass(shift) {
    const shiftClasses = {
        'Frühschicht': 'calendar__entry--frühschicht',
        'Spätschicht': 'calendar__entry--spätschicht',
        'Nachtschicht': 'calendar__entry--nachtschicht',
        'Werkstatt': 'calendar__entry--werkstatt',
        'Berreitschaft': 'calendar__entry--berreitschaft',
        'Lehrgang': 'calendar__entry--lehrgang'
    };
    return shiftClasses[shift] || '';
}
//!SECTION - Schicht Classe for background

//SECTION - Format Date
//FIXME - wird noch nicht verwendet
export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
//!SECTION - Format Date

// SECTION - Automatische Zeitvorgabe
const shiftTimes = {
    "Frühschicht": { start: "05:30", end: "13:30" },
    "Spätschicht": { start: "13:30", end: "21:30" },
    "Nachtschicht": { start: "21:30", end: "05:30" },
    "Werkstatt": { start: "05:30", end: "13:30" },
    "Berreitschaft": { start: "15:00", end: "06:00" },
    "Lehrgang": { start: "08:00", end: "16:00" }
};

//SECTION - Automatische Zeitvorgabe
export function setDefaultTimes(shift, date) {
    const startTime = shiftTimes[shift].start;
    const isDayTomorrow = shift === "Nachtschicht" || shift === "Berreitschaft";
    const formattedStart = `${date}T${startTime}:00`;
    const formattedEnd = formatEndTime(date, shiftTimes[shift].end, isDayTomorrow);

    document.getElementById("modal__add--start-time").value = formattedStart;
    document.getElementById("modal__add--end-time").value = formattedEnd;
}

function formatEndTime(date, endTime, isDayTomorrow) {
    if (isDayTomorrow) {
        const startDate = new Date(`${date}T${endTime}:00`);
        startDate.setDate(startDate.getDate() + 1);
        return `${startDate.toISOString().split('T')[0]}T${endTime}:00`;
    }
    return `${date}T${endTime}:00`;
}

// function calculateWorkingTime(startTime, endTime) {
//     const diff = new Date(endTime) - new Date(startTime);
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const minutes = Math.round((diff % (1000 * 60 * 60)) / (1000 * 60));
//     return {
//         totalHours: (diff / (1000 * 60 * 60)).toFixed(2),
//         hoursAndMinutes: `${hours}h ${minutes}m`
//     };
// }

// Berechnung der Arbeitszeit
// const { totalHours, hoursAndMinutes } = calculateWorkingTime(start_time, end_time);
//!SECTION - Automatische Zeitvorgabe
