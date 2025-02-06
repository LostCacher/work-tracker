//SECTION - Log-Funktion
const isDebugMode = true; // true (logs aktive / false logs deaktiviert)
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


//SECTION - Extract Year and Month
export function extractYearAndMonth(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Monate sind nullbasiert
    return { year, month };
}
//!SECTION - Extract Year and Month


//SECTION - Check Vilidity from Modal
export function checkValidity(modalId) {
    const modal = document.getElementById(modalId);
    const form = modal.querySelector("form");

    if (!form) {
        log(`Kein Formular im Modal mit der ID "${modalId}" gefunden.`, 'error');
        return false;
    }

    // Form validieren
    if (!form.checkValidity()) {
        form.classList.add("was-validated"); // Bootstrap-Style für Validierung
        return false;
    }

    // Validierung bestanden
    return true;
}
//!SECTION - Check Vilidity from Modal


//SECTION - Generate Alert Message
export function generateAlert(errorID, message, type = 'danger', duration = 5000) {
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', `alert-${type}`, 'fade', 'show');
    alertDiv.setAttribute('role', 'alert');

    const alertText = document.createElement('div');
    alertText.classList.add('d-flex', 'justify-content-between', 'align-items-center', 'text-center');

    const iconStart = document.createElement('i');
    iconStart.classList.add('bi', 'bi-exclamation-triangle', 'm-2');
    alertText.appendChild(iconStart);

    const messageText = document.createElement('strong');
    messageText.innerText = message;
    alertText.appendChild(messageText);

    const iconEnd = document.createElement('i');
    iconEnd.classList.add('bi', 'bi-exclamation-triangle', 'm-2');
    alertText.appendChild(iconEnd);

    alertDiv.appendChild(alertText);
    errorID.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.classList.remove('show');
        alertDiv.classList.add('fade');
        setTimeout(() => alertDiv.remove(), 200);
    }, duration);
}
//!SECTION - Generate Alert Message


//SECTION - Load Entry Data
export function loadEntryData(entryId, modalId) {
    fetch(`/api/vacation_entries/${entryId}`)
        .then(response => response.json())
        .then(data => {
            const form = modalId.querySelector('form');
            form.elements['id'].value = data.id;

            // Datum formatieren
            const date = new Date(data.vacation_date);
            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            form.elements['vacation_date'].value = formattedDate;
        })
        .catch(error => log(`Fehler beim Laden der Eintragsdaten: ${error}`, 'error'));
}
//!SECTION - Load Entry Data


//SECTION - backup question
export function backupQuestion(event, action, callback) {
    const button = event.target;
    let clickCount = 0;
    let timer;
    let removeListenerTimer;

    // Funktion zum Starten des Timers
    const startTimer = () => {
        timer = setTimeout(() => {
            clickCount = 0; // Reset click count after timeout
        }, 500);
    };

    // Funktion zum Abbrechen des Timers
    const cancelTimer = () => {
        clearTimeout(timer);
    };

    // Funktion zum Entfernen des Event-Listeners nach 3 Sekunden
    const startRemoveListenerTimer = () => {
        removeListenerTimer = setTimeout(() => {
            if (button.hasEventListener) {
                button.removeEventListener('click', checkClicks);
                button.hasEventListener = false;
            }
        }, 3000);
    };

    // Funktion zum Überprüfen der Klicks
    const checkClicks = () => {
        clickCount++;
        if (clickCount === 1) {
            startTimer();
            startRemoveListenerTimer(); // Startet den Timer zum Entfernen des Event-Listeners
        }
        if (clickCount === 3) {
            cancelTimer();
            clearTimeout(removeListenerTimer); // Stoppt den Timer zum Entfernen des Event-Listeners
            callback();
            // Entferne den Event-Listener nach erfolgreicher Ausführung
            if (button.hasEventListener) {
                button.removeEventListener('click', checkClicks);
                button.hasEventListener = false;
            }
        }
    };

    // Klick-Event-Listener hinzufügen, wenn er noch nicht vorhanden ist
    if (!button.hasEventListener) {
        button.addEventListener('click', checkClicks);
        button.hasEventListener = true;
    }
}
//!SECTION - Handle Long Press

// Funktion zur Berechnung der Kalenderwoche
export function getWeekNumber(date) {
    const tempDate = new Date(date.getTime());
    tempDate.setUTCDate(tempDate.getUTCDate() + 4 - (tempDate.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
    const weekNumber = Math.ceil((((tempDate - yearStart) / 86400000) + 1) / 7);
    return weekNumber;
}
