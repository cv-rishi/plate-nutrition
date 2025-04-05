## An App to calculate nutritional values of food items at a mess / canteen

## Features

- Login screen, Generaly 3 types of users

  - Admin
  - Nutritionist
  - Mess Staff
  - User

- Admin

  - Administrative taks.
  - Add, edit, delete food items

- Nutritionist

  - Specifiy nutritional values of food items

- Mess Staff

  - Take daily images of the food items (on plates, in containers, etc.)
  - Take the weight / density of the food items

- User
  - Can take images of food items
  - Server will run a model to detect food items in the image and calculate nutritional values
  - Diplay nutritional values of food items
  - Display a rating / satisfaction score of the food item

## UI / UX

- Login screen takes them to user dashboard, or admin dashboard, or nutritionist dashboard, or mess staff dashboard

- User dashboard displays a camera view, with a button to take a picture, and after the server processes the image, it displays the nutritional values of the food item, and a rating / satisfaction score of the food item

- Admin dashboard displays a list of food items, with options to add, edit, delete food items

- Nutritionist dashboard displays a list of food items, with options to specify nutritional values of food items, take the weight / density of the food items

- Mess staff dashboard displays a list of food items, with options to take daily images of the food items (on plates, in containers, etc.)

## Backend

- authentication and authorization for the app

- A web server that takes images of food items, and runs a model to detect food items in the image and calculate nutritional values

- A database to store food items, nutritional values, and images of food items

- Checks for stuff like is a plate empty, is the food item in the image, is the food item in the database, etc. (without using a model, with opencv?)

- Image segmentatoin to find food items / diffrent items

- Volume estimation of food itemms

- model to detect food items in the image and calculate nutritional values

## Tech Stack

- React native for the mobile app

- Rust for the backend
  - Authentication and authorization with JWT, and bcrypt?
  - Actix-web for the web server
  - Diesel for the database
  - OpenCV for image processing ( python ? )
  - Tensorflow for the model to detect food items in the image and calculate nutritional values ( python ? )

### TODO

- [x] Create a login screen
- [] Create a home screen
- [x] User dashboard / camera view page, with a button to take a picture, results page, rating / satisfaction score
- [x] Admin dashboard, with a list of food items, with options to add, edit, delete food items
- [] Nutritionist dashboard, with a list of food items, with options to specify nutritional values of food items
