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
2. Navigate to the api folder: cd api
3. Install dependencies: npm install
4. Create a .env file with:
   - MONGO_URI=your_mongodb_connection_string
   - SESSION_SECRET=your_secret
   - PORT=3000
5. Run the server: npx nodemon app.js

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
