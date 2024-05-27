import "./App.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/Themes/Theme-provider";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { Home } from "./components/Home";
import Error from "./components/Error";

const App = () => {
  const prefersDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="*" element={<Error />} />
      </Route>
    )
  );

  return (
    <>
      <ThemeProvider
        defaultTheme={prefersDarkMode ? "dark" : "light"}
        storageKey="vite-ui-theme"
      >
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </>
  );
};

export default App;
