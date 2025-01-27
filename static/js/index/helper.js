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
            console.info('Die Anwendung läuft im Produktionsmodus. -> Alle logs sind ausgeschaltet');
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
        'Frühschicht': 'calendar__cell--frühschicht',
        'Spätschicht': 'calendar__cell--spätschicht',
        'Nachtschicht': 'calendar__cell--nachtschicht',
        'Werkstatt': 'calendar__cell--werkstatt',
        'Berreitschaft': 'calendar__cell--berreitschaft',
        'Lehrgang': 'calendar__cell--lehrgang'
    };
    return shiftClasses[shift] || '';
}
//!SECTION - Schicht Classe for background
