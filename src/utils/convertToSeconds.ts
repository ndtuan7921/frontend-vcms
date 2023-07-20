const convertToSeconds = (timeString: string) => {
  const timeParts = timeString.split(":");
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const secs = parseInt(timeParts[2], 10);

  return hours * 3600 + minutes * 60 + secs;
};

export default convertToSeconds;
