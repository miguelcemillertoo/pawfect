from flask import Flask
from models import db

# Create app object
app = Flask(__name__)

# Set configs
app.config.from_object('config.Config')

# Context
app.app_context().push()

# Create db object
db.init_app(app)

from views import *

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')