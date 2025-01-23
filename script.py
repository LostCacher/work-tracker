import os

from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy

# Initialize the Flask app
app = Flask(__name__)

# Configure database
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f'sqlite:///{os.path.join(BASE_DIR, "work_tracker.db")}'
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize the database
db = SQLAlchemy(app)


# Define database models
class WorkEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(10), nullable=False)
    shift = db.Column(db.String(20), nullable=False)  # E.g., morning, evening, night
    hours_worked = db.Column(db.Float, nullable=False)
    overtime = db.Column(db.Float, nullable=True, default=0.0)


class Vacation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.String(10), nullable=False)
    end_date = db.Column(db.String(10), nullable=False)
    description = db.Column(db.String(100), nullable=True)


# Routes
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/work_entries", methods=["GET", "POST"])
def work_entries():
    if request.method == "POST":
        data = request.get_json()
        entry = WorkEntry(
            date=data["date"],
            shift=data["shift"],
            hours_worked=data["hours_worked"],
            overtime=data.get("overtime", 0.0),
        )
        db.session.add(entry)
        db.session.commit()
        return jsonify({"message": "Work entry added successfully!"}), 201

    # GET request: return all work entries
    entries = WorkEntry.query.all()
    return jsonify(
        [
            {
                "id": e.id,
                "date": e.date,
                "shift": e.shift,
                "hours_worked": e.hours_worked,
                "overtime": e.overtime,
            }
            for e in entries
        ]
    )


@app.route("/api/vacations", methods=["GET", "POST"])
def vacations():
    if request.method == "POST":
        data = request.get_json()
        vacation = Vacation(
            start_date=data["start_date"],
            end_date=data["end_date"],
            description=data.get("description", ""),
        )
        db.session.add(vacation)
        db.session.commit()
        return jsonify({"message": "Vacation added successfully!"}), 201

    # GET request: return all vacations
    vacations = Vacation.query.all()
    return jsonify(
        [
            {
                "id": v.id,
                "start_date": v.start_date,
                "end_date": v.end_date,
                "description": v.description,
            }
            for v in vacations
        ]
    )


@app.route("/api/work_entries", methods=["GET"])
def get_work_entries():
    entries = WorkEntry.query.all()
    result = [
        {
            "id": entry.id,
            "date": entry.date,
            "shift": entry.shift,
            "hours_worked": entry.hours_worked,
            "overtime": entry.overtime,
        }
        for entry in entries
    ]
    return jsonify(result), 200


# Initialize the database tables
def create_tables():
    with app.app_context():
        db.create_all()


# Rufe die Funktion zur Erstellung der Tabellen auf
create_tables()

# Run the app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
