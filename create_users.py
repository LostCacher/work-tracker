from werkzeug.security import generate_password_hash

from models import User, db
from work_tracker import app

with app.app_context():
    db.create_all()
    username = "username"
    password = "password"
    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    print(f"User {username} created successfully!")
