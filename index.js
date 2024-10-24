import express from "express"; // Import express module
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs

const app = express(); // Create an express application

app.use(express.json()); // Middleware to parse JSON bodies

// dummy data
const users = [
  {
    id: "1",
    firstName: "Bruce",
    lastName: "Wayne",
    hobby: "Fighting Criminal",
  },
  {
    id: "2",
    firstName: "Punit",
    lastName: "Panda",
    hobby: "Tea Lover",
  },
  {
    id: "3",
    firstName: "Green",
    lastName: "Goblin",
    hobby: "Troubling spiderman",
  },
  {
    id: "4",
    firstName: "Ankit",
    lastName: "Deepak",
    hobby: "Gamer boy",
  },
  {
    id: "4",
    firstName: "Nirmala",
    lastName: "Sitaraman",
    hobby: "Tax collection",
  },

];

// Middleware to log request details
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Pass to the next middleware or route handler
});

// Validation middleware for POST and PUT requests
const validateUser = (req, res, next) => {
  const { firstName, lastName, hobby } = req.body;
  if (!firstName || !lastName || !hobby) {
    return res
      .status(400)
      .json({ error: "All fields (firstName, lastName, hobby) are required" });
  }
  next();
};

// GET /users – Fetch the list of all users
app.get("/users", (req, res) => {
  res.status(200).json(users); // Send user array with status 200
});

// GET /users/:id – Fetch details of a specific user by ID
app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  const user = users.find((user) => user.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(200).json(user); // Send the user details
});

// POST /user – Add a new user
app.post("/add-user", validateUser, (req, res) => {
  const { firstName, lastName, hobby } = req.body;
  const newUser = {
    id: uuidv4(), // Generate unique ID
    firstName,
    lastName,
    hobby,
  };
  users.push(newUser); // Add new user to the users array
  res.status(201).json(newUser); // Send the newly added user with status 201 (Created)
});

// PUT /user/:id – Update details of an existing user
app.put("/update-user/:id", validateUser, (req, res) => {
  const userId = req.params.id;
  const user = users.find((user) => user.id === userId);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  // Update user details
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.hobby = req.body.hobby;
  res.status(200).json(user); // Send the updated user details
});

// DELETE /user/:id – Delete a user by ID
app.delete("/delete-user/:id", (req, res) => {
  const userId = req.params.id;
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ error: "User not found" });
  }
  users.splice(userIndex, 1); // Remove user from the users array
  res.status(200).json({ message: "User deleted successfully" }); // Send confirmation message
});

// Handle 404 for any other routes
app.use((req, res) => {
  res.status(404).json({ error: "Resource not found" });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// server on port 4000
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
