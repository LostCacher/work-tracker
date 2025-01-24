document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-mode');

    // Setze den gespeicherten Modus (oder Standard: Dark Mode)
    const savedMode = localStorage.getItem('theme') || 'dark-mode';
    document.body.className = savedMode;

    // Setze den Button-Text basierend auf dem Modus
    toggleButton.textContent = savedMode === 'dark-mode' ? 'Light Mode' : 'Dark Mode';

    // Event-Listener für den Button
    toggleButton.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            document.body.className = 'light-mode';
            toggleButton.textContent = 'Dark Mode';
            localStorage.setItem('theme', 'light-mode');
        } else {
            document.body.className = 'dark-mode';
            toggleButton.textContent = 'Light Mode';
            localStorage.setItem('theme', 'dark-mode');
        }
    });
});


async function loadWorkEntries() {
    try {
        const response = await fetch('/api/work_entries', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const entries = await response.json();
            const tableBody = document.getElementById('work-entries');
            tableBody.innerHTML = ''; // Bestehende Einträge löschen

            entries.forEach(entry => {
                const row = document.createElement('tr');

                row.innerHTML = `
    <td>${entry.date}</td>
    <td>${entry.shift}</td>
    <td>${entry.hours_worked}</td>
    <td>${entry.overtime}</td>
    `;

                tableBody.appendChild(row);
            });
        } else {
            console.error('Failed to load entries:', response.statusText);
        }
    } catch (error) {
        console.error('Error loading entries:', error);
    }
}

// Lade Einträge beim Laden der Seite
document.addEventListener('DOMContentLoaded', loadWorkEntries);

document.getElementById("submit-button").addEventListener("click", async function () {
    const form = document.getElementById("work-entry-form");
    const data = {
        date: form.date.value,
        shift: form.shift.value,
        hours_worked: parseFloat(form.hours_worked.value),
        overtime: parseFloat(form.overtime.value || 0) // Standardwert 0, falls leer
    };

    try {
        const response = await fetch("/api/work_entries", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Entry added successfully!");
            form.reset(); // Formular zurücksetzen

            // Nach erfolgreichem Hinzufügen, Einträge neu laden
            await loadWorkEntries();
        } else {
            alert("Failed to add entry: " + response.statusText);
        }
    } catch (error) {
        console.error("Error submitting form:", error);
    }
});
