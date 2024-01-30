const url1 = `https://timeapi.io/api/Time/current/zone?timeZone=Europe/London`;
const currentTime = await axios.get(url1);
console.log(currentTime.data.time);