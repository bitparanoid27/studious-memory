const PascalCase = (countryName: string): string => {
  return countryName
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export default PascalCase;
