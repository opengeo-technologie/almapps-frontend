import { environment } from "../../environments/environment";

export const APP_CONSTANTS = {
  // API_BASE_URL: "http://127.0.0.1:8000",
  API_BASE_URL: environment.apiUrl,
  DEFAULT_LANGUAGE: "en",
  ITEMS_PER_PAGE: 10,
};
