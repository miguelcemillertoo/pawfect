from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(100), nullable=False)
    pets = db.Column(db.String(300), nullable=True)
    image_filename = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return self.username

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

class Pets(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner = db.Column(db.String(100), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    breed = db.Column(db.String(100), nullable=False)
    coat_color = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(100), nullable=False)
    birthday = db.Column(db.String(100), nullable=False)
    image_filename = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return self.name

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}