import os
from datetime import datetime, timedelta

from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy

# Flask-App initialisieren
app = Flask(__name__)

# Datenbank konfigurieren
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DB_PATH = os.path.join(BASE_DIR, "db", "work_tracker.db")
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{DB_PATH}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Datenbank initialisieren
db = SQLAlchemy(app)


# Datenbankmodelle definieren
class WorkEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    shift = db.Column(
        db.String(50), nullable=False
    )  # Schicht: Frühschicht, Spätschicht, etc.
    start_time = db.Column(
        db.String(16), nullable=False
    )  # Startzeit im Format 'dd.mm.yyyy HH:MM'
    end_time = db.Column(
        db.String(16), nullable=False
    )  # Endzeit im Format 'dd.mm.yyyy HH:MM'
    working_time = db.Column(db.Float, nullable=False)  # Arbeitszeit in Stunden

    def calculate_working_time(self):
        # Berechnung der Arbeitszeit
        start = datetime.strptime(self.start_time, "%d.%m.%Y %H:%M")
        end = datetime.strptime(self.end_time, "%d.%m.%Y %H:%M")
        self.working_time = (end - start).total_seconds() / 3600  # Stunden


class Vacation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.String(10), nullable=False)
    end_date = db.Column(db.String(10), nullable=False)
    description = db.Column(db.String(100), nullable=True)


# Routen definieren
@app.route("/")
def home():
    """Lädt die Startseite."""
    return render_template("index.html")


@app.route("/api/work_entries", methods=["GET", "POST"])
def work_entries():
    """Verarbeitet Work-Einträge (GET & POST)."""
    if request.method == "POST":
        # POST: Neuen Eintrag hinzufügen
        data = request.get_json()

        # Holen der Daten
        shift = data["shift"]
        start_time = data["start_time"]  # Startzeit im Format 'yyyy-mm-ddThh:mm'
        end_time = data["end_time"]  # Endzeit im Format 'yyyy-mm-ddThh:mm'

        # Berechnung der Arbeitszeit
        start = datetime.strptime(start_time, "%Y-%m-%dT%H:%M")  # Passenderes Format
        end = datetime.strptime(end_time, "%Y-%m-%dT%H:%M")  # Passenderes Format
        working_time = (end - start).total_seconds() / 3600  # Arbeitszeit in Stunden

        # Neuer WorkEntry
        new_entry = WorkEntry(
            shift=shift,
            start_time=start_time,
            end_time=end_time,
            working_time=working_time,
        )

        # Speichern des neuen Eintrags
        db.session.add(new_entry)
        db.session.commit()

        return jsonify({"message": "Work entry added successfully!"}), 201

    # GET: Alle Einträge abrufen
    entries = WorkEntry.query.all()
    return jsonify(
        [
            {
                "id": entry.id,
                "shift": entry.shift,
                "start_time": entry.start_time,
                "end_time": entry.end_time,
                "working_time": entry.working_time,
            }
            for entry in entries
        ]
    )


@app.route("/api/vacations", methods=["GET", "POST"])
def vacations():
    """Verarbeitet Urlaubsdaten (GET & POST)."""
    if request.method == "POST":
        # POST: Neuen Urlaub hinzufügen
        data = request.get_json()
        new_vacation = Vacation(
            start_date=data["start_date"],
            end_date=data["end_date"],
            description=data.get("description", ""),
        )
        db.session.add(new_vacation)
        db.session.commit()
        return jsonify({"message": "Vacation added successfully!"}), 201

    # GET: Alle Urlaube abrufen
    vacations = Vacation.query.all()
    return jsonify(
        [
            {
                "id": vacation.id,
                "start_date": vacation.start_date,
                "end_date": vacation.end_date,
                "description": vacation.description,
            }
            for vacation in vacations
        ]
    )


# Datenbanktabellen erstellen
def create_tables():
    """Erstellt die Tabellen in der Datenbank, falls sie nicht existieren."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with app.app_context():
        db.create_all()


# Tabellen beim Start erstellen
create_tables()

# App starten
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
