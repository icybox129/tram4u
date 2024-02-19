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
    
    
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${apiKey}&mode=transit&transit_mode=tram`;
    
    const travelData = await axios.get(url);
    
    const urlCurrentTime = `https://timeapi.io/api/Time/current/zone?timeZone=Europe/London`;
    
    const currentTime = await axios.get(urlCurrentTime);

    const nick = currentTime.data.time;

    const stepsLength = travelData.data.routes[0].legs[0].steps.length;

    console.log(travelData.data)

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

    console.log(`Google API: ${firstDepartureTime}`)
    console.log(`Time API: ${nick}`)
    const firstParsedTime = new Date(`2000-01-01 ${firstDepartureTime}`);
    const firstFormattedTime = firstParsedTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    console.log(`First Parsed: ${firstParsedTime}`)
    console.log(`First Formatted: ${firstFormattedTime}`)
 
    // Parse times using moment
    const firstMoment1 = moment(nick, 'HH:mm');
    const firstMoment2 = moment(firstFormattedTime, 'HH:mm');
    console.log(firstMoment1)
    console.log(firstMoment2)
  
    // Calculate the time difference in minutes
    const firstTimeDifferenceMinutes = firstMoment2.diff(firstMoment1, 'minutes');
  
    let firstResultMessage;
  
    if (firstTimeDifferenceMinutes >= 60) {
      const hours = Math.floor(firstTimeDifferenceMinutes / 60);
      const remainingMinutes = firstTimeDifferenceMinutes % 60;
      firstResultMessage = `${hours}h ${remainingMinutes} min`;
    } else {
      firstResultMessage = `${firstTimeDifferenceMinutes } min`;
    }

    const secondParsedTime = new Date(`2000-01-01 ${secondDepartureTime}`);
    const secondFormattedTime = secondParsedTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })

    // Parse times using moment
    const secondMoment1 = moment(nick, 'HH:mm');
    const secondMoment2 = moment(secondFormattedTime, 'HH:mm');
  
    // Calculate the time difference in minutes
    const secondTimeDifferenceMinutes = secondMoment2.diff(secondMoment1, 'minutes');
  
    let secondResultMessage;
  
    if (secondTimeDifferenceMinutes >= 60) {
      const hours = Math.floor(secondTimeDifferenceMinutes / 60);
      const remainingMinutes = secondTimeDifferenceMinutes % 60;
      secondResultMessage = `${hours}h ${remainingMinutes} min`;
    } else {
      secondResultMessage = `${secondTimeDifferenceMinutes} min`;
    }
      

    if (stepsLength > 1) {
      
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
        firstResultMessage: firstResultMessage,
        secondResultMessage: secondResultMessage,
      });
    } 
    
    else {
      firstDepartureTime = travelData.data.routes[0].legs[0].steps[0].transit_details.departure_time.text;
      firstArrivalTime = travelData.data.routes[0].legs[0].steps[0].transit_details.arrival_time.text;
      firstColour = travelData.data.routes[0].legs[0].steps[0].transit_details.line.color;
      firstLineName = travelData.data.routes[0].legs[0].steps[0].transit_details.line.short_name;
      firstDurationTime = travelData.data.routes[0].legs[0].steps[0].duration.text;
      
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
        firstResultMessage: firstResultMessage,
        secondResultMessage: null,
      });
    }
  } 
  
  catch (error) {
    console.error(error);
    res.render('search.ejs')
    // res.status(500).send(`Internal Server Error: ${error.message}`);
  }
});


app.listen(port, function () {
  console.log(`Sever is running on ${port}. Press CTRL + C to shutdown. http://localhost:3000/`);
});
