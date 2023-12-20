import { Timestamp } from "firebase/firestore";

export const formatDate = (date) => {
  // Format the date as a string (e.g., "2021-07-29")
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export const formatTime = (time) => {
  // Format the time as a string (e.g., "12:00am")
  let hours = time.getHours();
  let minutes = time.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  const strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
};

// Function to format DateTime
export const formatDateTime = (dateTime) => {
  return `${formatDate(dateTime)} ${formatTime(dateTime)}`;
};

export const castDateTimeAsTimeStamp = (dateTime) => {
  const [datePart, timePart] = dateTime.split(" ");
  const [year, month, day] = datePart.split("-").map((num) => parseInt(num, 10));
  let [hours, minutes] = timePart.split(":").map((num) => parseInt(num, 10));
  const ampm = timePart.slice(-2);

  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  return Timestamp.fromDate(new Date(year, month - 1, day, hours, minutes));
};
