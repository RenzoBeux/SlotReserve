import { contract } from "../../../ts-rest-contract/src/index";
import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { auth } from "@/lib/firebase";
import { tsRestFetchApi } from "@ts-rest/core";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const tsrReactQuery = initTsrReactQuery(contract, {
  baseUrl: API_BASE_URL,
  baseHeaders: {
    "content-type": "application/json",
    accept: "application/json",
  },

  api: async (args) => {
    const token = await auth.currentUser?.getIdToken();
    return tsRestFetchApi({
      ...args,
      headers: {
        ...args.headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
});
