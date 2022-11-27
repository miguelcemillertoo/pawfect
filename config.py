import os
from os.path import join, dirname

class Config: 
    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    STATIC_FOLDER = 'static'
    TEMPLATES_FOLDER = 'templates'
    TEMPLATES_AUTO_RELOAD = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False