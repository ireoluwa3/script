export function slugify(str: string) {
  return str
    .replace(/^\s+|\s+$/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const RE_DIGIT = /^\d+$/;

export function toCamelCase(path) {
  return path
    .split("/") // Split the string by '/' to process directory and file separately
    .map((part) => {
      return part
        .toLowerCase() // Convert the entire string to lower case
        .split(" ") // Split the string by space to find individual words
        .map((word, index) => {
          // If it's the first word, return as is; otherwise capitalize the first letter
          if (index === 0) return word;
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(""); // Join the words back together without spaces
    })
    .join("/"); // Join the directory and file parts back with '/'
}

export const randomUniqueId = () => {
  return Math.random().toString(36).substr(2, 9);
};
