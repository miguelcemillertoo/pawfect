import os
from os.path import join, dirname, realpath
from werkzeug.utils import secure_filename
from uuid import uuid4
import numpy as np
from glob import glob
import tensorflow
from keras.preprocessing import image
from keras.models import load_model
import pickle

USER_IMAGES_PATH = join(dirname(realpath(__file__)), 'static/images/user-images')
PET_IMAGES_PATH = join(dirname(realpath(__file__)), 'static/images/pet-images')
TEMP_PATH = join(dirname(realpath(__file__)), 'static/images/temp')

BREEDS = ['American Bully', 'Belgian Malinois', 'Chihuahua', 'Chow-Chow', 'Daschund', 'German-Shepherd', 'Golden Retriever', 'Husky', 'Poodle', 'Shih-Tzu']

# VGG16 CONVOLUTION
VGG16_convolution = load_model(join(dirname(realpath(__file__)), 'static/algorithms/VGG16_convolution.hdf5'), compile=False)
# SVM CLASSIFIER
SVM_classifier = pickle.load(open('static/algorithms/SVM_classifier.pkl', "rb"))

def save_image(image, category):
    if image.filename != '':
        image_filename = str(uuid4()) + secure_filename(image.filename)
        if category == 'user':
            image.save(os.path.join(USER_IMAGES_PATH, image_filename))
        elif category == 'pet':
            image.save(os.path.join(PET_IMAGES_PATH, image_filename))
        image.stream.seek(0)
        return image_filename

def path_to_tensor(img_path):
    # loads RGB image as PIL.Image.Image type
    img = image.load_img(img_path, target_size=(224, 224))
    # convert PIL.Image.Image type to 3D tensor with shape (224, 224, 3)
    x = image.img_to_array(img)
    # convert 3D tensor to 4D tensor with shape (1, 224, 224, 3) and return 4D tensor
    #print("New Shape ", np.expand_dims(x, axis=0).shape)
    return np.expand_dims(x, axis=0)

def clear_temp():
    files = glob(join(dirname(realpath(__file__)), 'static/images/temp/*'))
    for f in files:
        os.remove(f)

def predict_breed(image):
    if image.filename != '':
        image_filename = str(uuid4()) + secure_filename(image.filename)
        image.save(os.path.join(TEMP_PATH, image_filename))
        image.stream.seek(0)

    # image path
    img_path = join(dirname(realpath(__file__)), 'static/images/temp/') + image_filename

    x = path_to_tensor(img_path)
    x = np.array(x)

    x_feature = VGG16_convolution.predict(x)
    x_features = x_feature.reshape(x_feature.shape[0], -1)

    prediction = SVM_classifier.predict(x_features)[0] 
    breed = BREEDS[prediction]

    print("BREED PREDICTION: ", breed)

    # CLEAR TEMP
    clear_temp()

    return breed





