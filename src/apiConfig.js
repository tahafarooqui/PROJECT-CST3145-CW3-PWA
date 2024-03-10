// Define base URLs for local and production environments
const BASE_URL_LOCAL = "https://mdxapp.eu-west-2.elasticbeanstalk.com/";
const BASE_URL_PROD = "https://mdxapp.eu-west-2.elasticbeanstalk.com/";

// Function to determine if the app is running in production
function isProduction() {
  return window.location.hostname !== "localhost";
}

// Use the appropriate base URL based on the environment
const BASE_URL = isProduction() ? BASE_URL_PROD : BASE_URL_LOCAL;

export { BASE_URL };
