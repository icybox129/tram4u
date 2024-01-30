// LEAVING TIMEs - in minutes

// Current time and departure time in HH:MM format (24-hour clock)
const currentTime = "10:39";
const departureTime = "10:48";

// Function to convert time to minutes
function timeToMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

// Calculate time in minutes for current time and departure time
const currentTimeMinutes = timeToMinutes(currentTime);
let departureTimeMinutes = timeToMinutes(departureTime);

// Handle cases where departure time is earlier than current time (indicating departure next day)
if (departureTimeMinutes < currentTimeMinutes) {
    departureTimeMinutes += 24 * 60; // Add 24 hours in minutes
}

// Calculate time difference in minutes
const timeDifferenceMinutes = departureTimeMinutes - currentTimeMinutes;

// Print the time left to start the journey
console.log("Time left to start the journey:", timeDifferenceMinutes, "minutes");