import express from 'express'
import cors from 'cors'
import restaurants from './api/restaurants.route.js'

// Establishes the express application / server
const app = express();

app.use(cors());
// Server can accept JSON in the body of a request
app.use(express.json());

app.use('/api/v1/restaurants', restaurants);
// Asterisk means if a user tries to access a route that doesn't exist
app.use('*', (req, res) => res.status(404).json({error: "Page not found."}));

// const port = 5000;

// app.listen(port, () => {
//     console.log(`Listening on port: ${port}`)
// })


export default app;
