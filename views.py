from flask import request, render_template, jsonify
from app import app, db
from models import Users, Pets
from utils import *
import json
from glob import glob


@app.route('/')
def sign_in_up():
    return render_template('sign-in-up.html')

# SIGN IN
@app.route('/sign-in', methods=['POST'])
def sign_in():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = Users.query.filter_by(username=username).first()
        if user is None:
            return {
                'isValid': False
            }

        if password == user.password:
            return {
                'username': user.username,
                'isValid': True
            }
        else:
            # wrong username / password
            return {
                'isValid': False
            }


@app.route('/sign-up')
def sign_up():
    return render_template('sign-up.html')

# HOME
@app.route('/home/<username>')
def home(username):
    # RETURN ALL PETS EXCEPT MINE
    pets = Pets.query.filter(Pets.owner != username).all()
    # pets_list = []

    # for pet in pets:
    #     pets_list.append(pet.as_dict())

    # RETURN USER DATA
    user = Users.query.filter_by(username=username).first()

    return render_template('home.html', username=username, pets=pets, user=user)

# PET VIEW
@app.route('/pet-view/<name>/<username>')
def pet_view(name, username):
    pet = Pets.query.filter_by(name=name).first()
    user = Users.query.filter_by(username=username).first()

    return render_template('pet-view.html', username=username, pet=pet, user=user)

# SAVE USER
@app.route('/save-user', methods=['POST'])
def save_user():
    if request.method == 'POST':
        name = request.form['name']
        username = request.form['username']
        password = request.form['password']
        address = request.form['address']
        image = request.files['image']

        image_filename = save_image(image, 'user')

        # SAVE USER
        user = Users(
            name=name,
            username=username, 
            password=password,
            address=address,
            pets='',
            image_filename=image_filename
        )

        db.session.add(user)
        db.session.commit()

        return {
            'name': name,
            'username': username,
            'password': password,
            'address': address,
            'pets': '',
            'imageFilename': image_filename
        }

# CREATE PET PROFILE
@app.route('/create-pet-profile/<username>', methods=['GET', 'POST'])
def create_pet_profile(username):
    if request.method == 'GET':
        return render_template('create-pet-profile.html', username=username)
    elif request.method == 'POST':

        return {
            'success': 'success'
        }

# SAVE PET
@app.route('/save-pet/<username>', methods=['POST'])
def save_pet(username):
    if request.method == 'POST':
        name = request.form['name']
        owner = username
        breed = request.form['breed']
        coat_color = request.form['coat_color']
        gender = request.form['gender']
        birthday = request.form['birthday']
        image = request.files['image']

        image_filename = save_image(image, 'pet')

        # SAVE PET
        pet = Pets(
            name=name, 
            owner=owner,
            breed=breed,
            coat_color=coat_color,
            gender=gender,
            birthday=birthday,
            image_filename=image_filename
        )

        db.session.add(pet)
        db.session.commit()

        # NOW ADD PET TO USER'S PETS
        user = Users.query.filter_by(username=username).first()
        pets_list = user.pets
        if pets_list == '':
            temp_list = []
            temp_list.append(name)
            temp_list_dump = json.dumps(temp_list)

            user.pets = temp_list_dump
            db.session.commit()

        return {
            'success': 'success'
        }

# PREDICT BREED
@app.route('/predict-breed', methods=['POST'])
def breed_prediction():
    image = request.files['image']

    breed = predict_breed(image)

    return {
        'breed': breed
    }
