from flask import request, render_template, jsonify
from app import app, db
from models import Users, Pets
from utils import *
import json
from glob import glob


# INDEX
@app.route('/')
def index():
    return render_template('index.html')

# FACE DETECTOR
@app.route('/face-detector', methods=['POST'])
def face_detection():
    image = request.files['image']
    
    isFace = face_detector(image)

    if isFace:
        clear_temp()

    return {
        'isFace': isFace
    }



# PREDICT BREED
@app.route('/predict-breed', methods=['POST'])
def breed_prediction():
    image = request.files['image']
    breed, image_filename = predict_breed(image)

    return {
        'imageFilename': image_filename,
        'breed': breed
    }


# PREDICT COAT COLOR
@app.route('/predict-coat-color', methods=['POST'])
def coat_color_prediction():
    image_filename = request.form['imageFilename']
    color = predict_coat_color(image_filename)

    return {
        'imageFilename': image_filename,
        'color': color
    }

# OFFSPRINGS FILEPATHS
@app.route('/offsprings-filepaths/<folder>/<folder_alt>', methods=["GET"])
def offsprings_filepaths(folder, folder_alt):
    folder_path = join(dirname(realpath(__file__)), 'static/images/offsprings/') + folder
    folder_path_alt = join(dirname(realpath(__file__)), 'static/images/offsprings/') + folder_alt

    offsprings_images_whole_paths = glob(folder_path+'/*')
    offsprings_images_whole_paths_alt = glob(folder_path_alt+'/*')

    offsprings_images_filenames = [os.path.basename(x) for x in offsprings_images_whole_paths]
    offsprings_images_filenames_alt = [os.path.basename(x) for x in offsprings_images_whole_paths_alt]

    offsprings_images_paths = []
    offsprings_images_paths_alt = []

    for x in offsprings_images_filenames:
        path = '/static/images/offsprings/'+folder+'/'+x 
        offsprings_images_paths.append(path)

    for x in offsprings_images_filenames_alt:
        path = '/static/images/offsprings/'+folder_alt+'/'+x 
        offsprings_images_paths_alt.append(path)

    
    if offsprings_images_paths:
        return {
            'offspringsFilepaths': offsprings_images_paths
        }
    elif offsprings_images_paths_alt:
        return {
            'offspringsFilepaths': offsprings_images_paths_alt
        }
    else:
        return {
            'offspringsFilepaths': []
        }
            


