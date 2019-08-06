import { Environment } from "./environment";

/**
 * This is a backend environment.
 *
 * It configures environment-specific things like the CORS-policy.
 */

export const environment: Environment = {
  corsWhitelist: [
    "http://localhost:420",
    "https://localhost:420",
    "http://localhost:4200",
    "https://localhost:4200"
  ]
};
