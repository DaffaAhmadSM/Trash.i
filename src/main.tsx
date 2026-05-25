import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { ProfileProvider } from "./context/ProfileContext";
import { HistoryProvider } from "./context/HistoryContext";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <HistoryProvider>
                <ProfileProvider>
                    <App />
                </ProfileProvider>
            </HistoryProvider>
        </BrowserRouter>
    </StrictMode>,
);
