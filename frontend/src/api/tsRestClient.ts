import { contract } from "../../../ts-rest-contract/src/index";
import { initTsrReactQuery } from "@ts-rest/react-query/v5";

// Set your backend API base URL here
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Initialize the TS-REST client
export const tsrReactQuery = initTsrReactQuery(contract, {
  baseUrl: API_BASE_URL,
  baseHeaders: {
    "Content-Type": "application/json",
  },
});
