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
import cv2

USER_IMAGES_PATH = join(dirname(realpath(__file__)), 'static/images/user-images')
PET_IMAGES_PATH = join(dirname(realpath(__file__)), 'static/images/pet-images')
TEMP_PATH = join(dirname(realpath(__file__)), 'static/images/temp')

BREEDS = ['American Bully', 'Belgian Malinois', 'Belgian Malinois x Labrador Retriever', 'Chihuahua', 'Chow Chow', 'Dachshund', 'German Shepherd', 'Golden Retriever', 'Husky', 'Labrador Retriever x Golden Retriever', 'Poodle', 'Shih-Tzu', 'Shih-Tzu x Aspin', 'Shih-Tzu x Pomeranian', 'Shih-Tzu x Poodle']

COLORS = ['Black', 'Black-Tan', 'Cream', 'Dark Golden', 'Fawn', 'Tan', 'White']

# VGG16 CONVOLUTION
VGG16_convolution = load_model(join(dirname(realpath(__file__)), 'static/algorithms/VGG16_convolution.hdf5'), compile=False)
# SVM CLASSIFIERS
SVM_breed_classifier = pickle.load(open('static/algorithms/SVM_breed_classifier.pkl', "rb"))
SVM_coat_color_classifier = pickle.load(open('static/algorithms/SVM_coat_color_classifier.pkl', "rb"))

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

    prediction = SVM_breed_classifier.predict(x_features)[0] 
    breed = BREEDS[prediction]

    print("The breed is: ", breed)

    return breed, image_filename


def predict_coat_color(image_filename):
    # image path
    img_path = join(dirname(realpath(__file__)), 'static/images/temp/') + image_filename

    x = path_to_tensor(img_path)
    x = np.array(x)

    x_feature = VGG16_convolution.predict(x)
    x_features = x_feature.reshape(x_feature.shape[0], -1)

    prediction = SVM_coat_color_classifier.predict(x_features)[0] 
    color = COLORS[prediction]

    print("The coat color is: ", color)

    # Clear images
    clear_temp()

    return color


def face_detector(image):
    # extract pre-trained face detector
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_alt.xml")

    if image.filename != '':
        filename = str(uuid4()) + secure_filename(image.filename)
        image.save(os.path.join(TEMP_PATH, filename))

        # reset image before reading again 
        # https://github.com/pallets/werkzeug/issues/1666
        image.stream.seek(0)
        
        image_filename = filename

    # image path
    img_path = join(dirname(realpath(__file__)), 'static/images/temp/') + image_filename

    # load color (BGR) image
    img = cv2.imread(img_path)
    # convert BGR image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # find faces in image
    faces = face_cascade.detectMultiScale(gray)

    # get bounding box for each detected face
    for (x,y,w,h) in faces:
        # add bounding box to color image
        cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,0),2)
        
    # convert BGR image to RGB for plotting
    cv_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # returns "True" if face is detected in image stored at img_path
    img = cv2.imread(img_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray)
    return len(faces) > 0


