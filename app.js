import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import moment from 'moment';

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
    // console.log(travelData.data);
    const urlCurrentTime = `https://timeapi.io/api/Time/current/zone?timeZone=Europe/London`;
    
    const currentTime = await axios.get(urlCurrentTime);

    const nick = currentTime.data.time;
    console.log(nick)



    const stepsLength = travelData.data.routes[0].legs[0].steps.length;
    console.log(stepsLength);

    let 
      firstDepartureTime = travelData.data.routes[0].legs[0].steps[0].transit_details.departure_time.text,
      firstArrivalTime = travelData.data.routes[0].legs[0].steps[0].transit_details.arrival_time.text,
      secondDepartureTime = travelData.data.routes[0].legs[0].steps[stepsLength - 1].transit_details.departure_time.text,
      secondArrivalTime = travelData.data.routes[0].legs[0].steps[stepsLength - 1].transit_details.arrival_time.text,
      firstColour = travelData.data.routes[0].legs[0].steps[0].transit_details.line.color,
      secondColour = travelData.data.routes[0].legs[0].steps[stepsLength - 1].transit_details.line.color,
      firstHeadSign = travelData.data.routes[0].legs[0].steps[0].transit_details.headsign,
      firstDepartureName = travelData.data.routes[0].legs[0].steps[0].transit_details.departure_stop.name,
      firstArrivalName = travelData.data.routes[0].legs[0].steps[0].transit_details.arrival_stop.name,
      secondHeadSign = travelData.data.routes[0].legs[0].steps[stepsLength - 1].transit_details.headsign,
      secondDepartureName = travelData.data.routes[0].legs[0].steps[stepsLength - 1].transit_details.departure_stop.name,
      secondArrivalName = travelData.data.routes[0].legs[0].steps[stepsLength - 1].transit_details.arrival_stop.name,
      firstLineName = travelData.data.routes[0].legs[0].steps[0].transit_details.line.short_name,
      secondLineName = travelData.data.routes[0].legs[0].steps[stepsLength - 1].transit_details.line.short_name,
      firstDurationTime = travelData.data.routes[0].legs[0].steps[0].duration.text,
      secondDurationTime = travelData.data.routes[0].legs[0].steps[stepsLength - 1].duration.text;

    // Assuming you have two time variables in HH:MM format
    const time1 = nick;
    const time2 = firstDepartureTime;
    console.log(nick, time2)
 
    // Parse times using moment
    const moment1 = moment(time1, 'HH:mm');
    const moment2 = moment(time2, 'HH:mm');
  
    // Calculate the time difference in minutes
    const timeDifferenceMinutes = moment2.diff(moment1, 'minutes');
  
    let resultMessage;
  
    if (timeDifferenceMinutes >= 60) {
      const hours = Math.floor(timeDifferenceMinutes / 60);
      const remainingMinutes = timeDifferenceMinutes % 60;
      resultMessage = `${hours}h ${remainingMinutes} min`;
    } else {
      resultMessage = `${timeDifferenceMinutes} min`;
      console.log(resultMessage)
    }
      

    if (stepsLength > 1) {
      // firstDepartureTime = travelData.data.routes[0].legs[0].steps[0].transit_details.departure_time.text;
      // firstArrivalTime = travelData.data.routes[0].legs[0].steps[0].transit_details.arrival_time.text;
      // secondDepartureTime = travelData.data.routes[0].legs[0].steps[stepsLength - 1].transit_details.departure_time.text;
      // secondArrivalTime = travelData.data.routes[0].legs[0].steps[stepsLength - 1].transit_details.arrival_time.text;
      // firstColour = travelData.data.routes[0].legs[0].steps[0].transit_details.line.color;
      // secondColour = travelData.data.routes[0].legs[0].steps[stepsLength - 1].transit_details.line.color;
      // firstHeadSign = travelData.data.routes[0].legs[0].steps[0].transit_details.headsign;
      // firstDepartureName = travelData.data.routes[0].legs[0].steps[0].transit_details.departure_stop.name;
      // firstArrivalName = travelData.data.routes[0].legs[0].steps[0].transit_details.arrival_stop.name;
      // secondHeadSign = travelData.data.routes[0].legs[0].steps[stepsLength - 1].transit_details.headsign;
      // secondDepartureName = travelData.data.routes[0].legs[0].steps[stepsLength - 1].transit_details.departure_stop.name;
      // secondArrivalName = travelData.data.routes[0].legs[0].steps[stepsLength - 1].transit_details.arrival_stop.name;
      // firstLineName = travelData.data.routes[0].legs[0].steps[0].transit_details.line.short_name;
      // secondLineName = travelData.data.routes[0].legs[0].steps[stepsLength - 1].transit_details.line.short_name;
      // firstDurationTime = travelData.data.routes[0].legs[0].steps[0].duration.text;
      // secondDurationTime = travelData.data.routes[0].legs[0].steps[stepsLength - 1].duration.text;

      console.log('Rendering 1st result.ejs');
      console.log(firstColour, secondColour);
      
      res.render('result.ejs', {
        firstDepart: firstDepartureTime,
        firstArrival: firstArrivalTime,
        secondDepart: secondDepartureTime,
        secondArrival: secondArrivalTime,
        firstColour: firstColour,
        secondColour: secondColour,
        firstHeadSign: firstHeadSign,
        firstDepartureName: firstDepartureName,
        firstArrivalName: firstArrivalName,
        secondHeadSign: secondHeadSign,
        secondDepartureName: secondDepartureName,
        secondArrivalName: secondArrivalName,
        firstLineName: firstLineName,
        secondLineName: secondLineName,
        firstDurationTime: firstDurationTime,
        secondDurationTime: secondDurationTime,
        resultMessage: resultMessage,
      });
    } 
    
    else {
      firstDepartureTime = travelData.data.routes[0].legs[0].steps[0].transit_details.departure_time.text;
      firstArrivalTime = travelData.data.routes[0].legs[0].steps[0].transit_details.arrival_time.text;
      firstColour = travelData.data.routes[0].legs[0].steps[0].transit_details.line.color;
      firstLineName = travelData.data.routes[0].legs[0].steps[0].transit_details.line.short_name;
      firstDurationTime = travelData.data.routes[0].legs[0].steps[0].duration.text;
      
      console.log('Rendering 2nd result.ejs');
      console.log(firstColour, secondColour);
      
      res.render('result.ejs', {
        firstDepart: firstDepartureTime,
        firstArrival: firstArrivalTime,
        secondDepart: null,
        secondArrival: null,
        firstColour: firstColour,
        secondColour: null,
        firstHeadSign: firstHeadSign,
        firstDepartureName: firstDepartureName,
        firstArrivalName: firstArrivalName,
        secondHeadSign: null,
        secondDepartureName: null,
        secondArrivalName: null,
        firstLineName: firstLineName,
        secondLineName: null,
        firstDurationTime: firstDurationTime,
        secondDurationTime: null,
        resultMessage: resultMessage,
      });
    }
  } 
  
  catch (error) {
    console.error(error);
    res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});


app.listen(port, function () {
  console.log(`Sever is running on ${port}. Press CTRL + C to shutdown. http://localhost:3000/`);
});
