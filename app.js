import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const port = 3000;
const app = express();

const apiKey = process.env.API_KEY;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
  res.render('index.ejs');
});

app.get('/search', async (req, res) => {
  res.render('search.ejs');
});

app.post('/', async (req, res) => {
  try {
    console.log('Received POST request');
    const origin = req.body.startingLocation;
    const destination = req.body.destinationLocation;
    console.log('Origin:', origin);
    console.log('Destination:', destination);
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}&mode=transit&transit_mode=tram`;
    const travelData = await axios.get(url);
    console.log(travelData.data);

    const stepsLength = travelData.data.routes[0].legs[0].steps.length;
    console.log(stepsLength);

    let firstDepartureTime,
      firstArrivalTime,
      secondDepartureTime,
      secondArrivalTime,
      firstColour,
      secondColour;
    if (stepsLength > 1) {
      firstDepartureTime =
        travelData.data.routes[0].legs[0].steps[0].transit_details.departure_time.text;
      firstArrivalTime =
        travelData.data.routes[0].legs[0].steps[0].transit_details.arrival_time.text;
      secondDepartureTime =
        travelData.data.routes[0].legs[0].steps[stepsLength - 1].transit_details.departure_time.text;
      secondArrivalTime =
        travelData.data.routes[0].legs[0].steps[stepsLength - 1].transit_details.arrival_time.text;
      firstColour =
        travelData.data.routes[0].legs[0].steps[0].transit_details.line.color
      secondColour =
        travelData.data.routes[0].legs[0].steps[stepsLength - 1].transit_details.line.color
      console.log('Rendering 1st result.ejs');
      console.log(firstColour, secondColour);
      res.render('result.ejs', {
        firstDepart: firstDepartureTime,
        firstArrival: firstArrivalTime,
        secondDepart: secondDepartureTime,
        secondArrival: secondArrivalTime,
        firstColour: firstColour,
        secondColour: secondColour,
      });
    } else {
      firstDepartureTime =
        travelData.data.routes[0].legs[0].steps[0].transit_details
          .departure_time.text;
      firstArrivalTime =
        travelData.data.routes[0].legs[0].steps[0].transit_details.arrival_time
          .text;
      firstColour =
        travelData.data.routes[0].legs[0].steps[0].transit_details.line.color
      console.log('Rendering 2nd result.ejs');
      console.log(firstColour, secondColour);
      res.render('result.ejs', {
        firstDepart: firstDepartureTime,
        firstArrival: firstArrivalTime,
        secondDepart: null,
        secondArrival: null,
        firstColour: firstColour,
        secondColour: null,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});


app.listen(port, function () {
  console.log(`Sever is running on ${port}. Press CTRL + C to shutdown. http://localhost:3000/`);
});
