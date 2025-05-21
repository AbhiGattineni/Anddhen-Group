// Catalize the sentence for each word
export const capitalizeName = name => {
  if (!name) return name;
  return name
    .split(' ') // Split the name by spaces
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize each word
    .join(' '); // Join the words back together
};
