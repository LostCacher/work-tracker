import os

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
    shift = db.Column(db.String(50), nullable=False)
    start_time = db.Column(db.String(16), nullable=False, index=True)
    end_time = db.Column(db.String(16), nullable=False)
    working_time = db.Column(db.Float, nullable=False)
    working_time_hm = db.Column(db.String(5), nullable=False)


# Routen definieren
@app.route("/")
def index():
    """Lädt die Startseite."""
    return render_template("index.html")


@app.route("/api/work_entries", methods=["GET"])
def get_work_entries():
    """Gibt gefilterte und sortierte Work-Einträge zurück."""
    year = request.args.get("year", type=int)
    month = request.args.get("month", type=int)
    sort_order = request.args.get("sort", default="desc", type=str)

    query = WorkEntry.query
    if year:
        query = query.filter(db.func.strftime("%Y", WorkEntry.start_time) == str(year))
    if month:
        query = query.filter(
            db.func.strftime("%m", WorkEntry.start_time) == f"{month:02}"
        )
    if sort_order == "asc":
        query = query.order_by(WorkEntry.end_time.asc())
    else:
        query = query.order_by(WorkEntry.end_time.desc())

    entries = query.all()
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


@app.route("/api/available_years_and_months", methods=["GET"])
def available_years_and_months():
    """Gibt die verfügbaren Jahre und Monate für Work-Einträge zurück."""
    years_query = db.session.query(
        db.func.strftime("%Y", WorkEntry.start_time)
    ).distinct()
    months_query = db.session.query(
        db.func.strftime("%Y", WorkEntry.start_time).label("year"),
        db.func.strftime("%m", WorkEntry.start_time).label("month"),
    ).distinct()

    years = [year[0] for year in years_query]
    months_by_year = {}

    for year in years:
        months = [
            month[1]
            for month in months_query.filter(
                db.func.strftime("%Y", WorkEntry.start_time) == year
            )
        ]
        months_by_year[year] = months

    return jsonify({"years": years, "months": months_by_year})


@app.route("/api/work_entries", methods=["POST"])
def add_work_entry():
    """Erstellt einen neuen Work-Eintrag."""
    data = request.get_json()
    try:
        new_entry = WorkEntry(
            shift=data["shift"],
            start_time=data["start_time"],
            end_time=data["end_time"],
            working_time=data["working_time"],
            working_time_hm=data["working_time_hm"],
        )
        db.session.add(new_entry)
        db.session.commit()
        return (
            jsonify({"message": "Work entry added successfully!", "id": new_entry.id}),
            201,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400


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


# Tabellen erstellen
def create_tables():
    """Erstellt die Tabellen in der Datenbank, falls sie nicht existieren."""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with app.app_context():
        db.create_all()


# Tabellen beim Start erstellen
create_tables()

# App starten
if __name__ == "__main__":
    app.run(host="10.0.0.5", port=5000, debug=True)
