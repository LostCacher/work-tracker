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

//SECTION - Standardzeiten für Schichten
export function getShiftTime(shift) {
    const shiftTimes = {
        "Frühschicht": { start: "05:30", end: "13:30" },
        "Spätschicht": { start: "13:30", end: "21:30" },
        "Nachtschicht": { start: "21:30", end: "05:30" },
        "Werkstatt": { start: "05:30", end: "13:30" },
        "Berreitschaft": { start: "15:00", end: "06:00" },
        "Lehrgang": { start: "08:00", end: "16:00" }
    };
    return shiftTimes[shift] || '';
}
//!SECTION - Standardzeiten für Schichten
