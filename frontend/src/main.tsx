import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/theme/theme-provider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { tsrReactQuery } from "./api/tsRestClient.ts";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" storageKey="bookify-theme">
    <QueryClientProvider client={new QueryClient()}>
      <tsrReactQuery.ReactQueryProvider>
        <App />
      </tsrReactQuery.ReactQueryProvider>
    </QueryClientProvider>
  </ThemeProvider>
);
