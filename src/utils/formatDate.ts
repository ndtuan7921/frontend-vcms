function formattedDate(str: string) {
  const createdAt = new Date(str);
  const formatted = createdAt.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  return formatted;
}
export default formattedDate;
