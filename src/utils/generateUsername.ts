export const generateUsername = (fullName: string): string => {
  // Remove special characters and extra spaces
  const cleanName = fullName
    .toLowerCase()
    .replace(/[^a-zA-Z\s]/g, '')
    .trim();

  // Split the name into parts
  const nameParts = cleanName.split(' ');

  // Get first name and last name (if available)
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];

  // Create base username variations
  const usernameOptions = [
    firstName,
    `${firstName}${lastName}`,
    `${firstName}${lastName.charAt(0)}`,
    `${firstName.charAt(0)}${lastName}`,
  ];

  // Select random username option
  const selectedBase =
    usernameOptions[Math.floor(Math.random() * usernameOptions.length)];

  // Generate random number between 100 and 999
  const randomNum = Math.floor(Math.random() * 900) + 100;

  return `${selectedBase}${randomNum}`;
};
