# RecipeRank API

## Authors
- Mohammad Abrar Farooqui (3116342)
- Buse Nur Shen (3135928)
- Numair Mughal (3139248)
- Max Tyndall (3146521)

## Description
RecipeRank is a REST API built with Node.js, Express, and MongoDB.
It allows users to register, log in, create recipes, filter recipes, 
leave reviews, and compare recipes.

## Technologies Used
- Node.js
- Express 4
- MongoDB Atlas
- Mongoose
- express-session
- bcryptjs
- cookie-parser
- dotenv
- cors

## How to Run Locally
1. Clone the repository
2. Navigate to the api folder (Backend setup): cd api
3. Install dependencies: npm install
4. Create a .env file in api folder and outside the api folder with:
   - MONGO_URI=mongodb+srv://busenur1331_db_user:Griffith.02@assignment2.7vqmsmx.mongodb.net/?appName=Assignment2
   - SESSION_SECRET=reciperank_67
   - PORT=9000
   - CLIENT_URL=http://localhost:3000
5. Run the server: npx nodemon app.js

![alt text](image.png)

1. Navigate to the client folder on another terminal (Frontend setup): cd client
2. Install dependencies: npm install
3. Create a .env file in the client folder with: 
   - REACT_APP_API_URL=http://localhost:9000
   - REACT_APP_CLIENT_URL=http://localhost:3000
4. Run the react app: npm start

![alt text](image-1.png)

## API Endpoints

### Users
| Method | URL | Description | Auth Required |
|--------|-----|-------------|---------------|
| POST | /api/users/register | Register a new user | No |
| POST | /api/users/login | Log in | No |
| POST | /api/users/logout | Log out | No |
| GET | /api/users/profile | View own profile | Yes |

### Recipes
| Method | URL | Description | Auth Required |
|--------|-----|-------------|---------------|
| GET | /api/recipes | Get all recipes | No |
| GET | /api/recipes?category=baking | Filter by category | No |
| GET | /api/recipes?difficulty=easy | Filter by difficulty | No |
| GET | /api/recipes?subcategory=cakes | Filter by subcategory | No |
| GET | /api/recipes/:id | Get one recipe | No |
| POST | /api/recipes | Create a recipe | Yes |
| PUT | /api/recipes/:id | Update a recipe | Yes |
| DELETE | /api/recipes/:id | Delete a recipe | Yes |

### Reviews
| Method | URL | Description | Auth Required |
|--------|-----|-------------|---------------|
| GET | /api/reviews/:recipeId | Get reviews for a recipe | No |
| POST | /api/reviews/:recipeId | Add a review | Yes |
| DELETE | /api/reviews/:id | Delete a review | Yes |

## Division of Labour
Work was evenly divided among all team members.

## References
- Express.js documentation: https://expressjs.com
- Mongoose documentation: https://mongoosejs.com
- MongoDB Atlas: https://www.mongodb.com/atlas
- bcryptjs: https://www.npmjs.com/package/bcryptjs
- express-session: https://www.npmjs.com/package/express-session
