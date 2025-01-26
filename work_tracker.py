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
    working_time_hm = db.Column(
        db.String(5), nullable=False
    )  # Arbeitszeit in Stunden und Minuten


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
        working_time = data["working_time"]
        working_time_hm = data["working_time_hm"]

        # Neuer WorkEntry
        new_entry = WorkEntry(
            shift=shift,
            start_time=start_time,
            end_time=end_time,
            working_time=working_time,
            working_time_hm=working_time_hm,
        )

        # Speichern des neuen Eintrags
        db.session.add(new_entry)
        db.session.commit()

        return jsonify({"message": "Work entry added successfully!"}), 201

    # GET: Alle Einträge mit optionaler Filterung nach Jahr und Monat
    year = request.args.get("year", type=int)
    month = request.args.get("month", type=int)

    # SQLAlchemy-Abfrage starten
    query = WorkEntry.query

    if year:
        query = query.filter(db.func.strftime("%Y", WorkEntry.start_time) == str(year))
    if month:
        query = query.filter(
            db.func.strftime("%m", WorkEntry.start_time) == f"{month:02}"
        )

    # Abfrage ausführen
    entries = query.all()

    # Ergebnis zurückgeben
    return jsonify(
        [
            {
                "id": entry.id,
                "shift": entry.shift,
                "start_time": entry.start_time,
                "end_time": entry.end_time,
                "working_time": entry.working_time,
                "working_time_hm": entry.working_time_hm,
            }
            for entry in entries
        ]
    )


@app.route("/api/work_entries/<int:id>", methods=["PUT", "DELETE"])
def manage_work_entry(id):
    """Bearbeiten (PUT) oder Löschen (DELETE) eines Work-Eintrags."""
    entry = db.session.get(WorkEntry, id)

    if not entry:
        return jsonify({"error": "Work entry not found"}), 404

    if request.method == "DELETE":
        db.session.delete(entry)
        db.session.commit()
        return jsonify({"message": "Work entry deleted successfully!"}), 200

    if request.method == "PUT":
        data = request.get_json()
        entry.shift = data["shift"]
        entry.start_time = data["start_time"]
        entry.end_time = data["end_time"]
        entry.working_time = data["working_time"]
        entry.working_time_hm = data["working_time_hm"]

        db.session.commit()
        return jsonify({"message": "Work entry updated successfully!"}), 200


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
