import { Environment } from "./environment.d";

export const environment: Environment = {
  production: true,
  baseUrl: window.location.host + "/api/v2" // don't append a slash
};
