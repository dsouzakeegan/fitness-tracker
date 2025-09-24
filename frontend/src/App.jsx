import { Button, Card } from "antd";
import "./App.css";
import LandingPage from "./components/LandingPage.jsx";
import SignupLoginPage from "./components/SignupLoginPage.jsx";
import { useState } from "react";
import Dashboard from "./components/Dashboard.jsx";
import { Provider } from "react-redux";
import store from "./store/index.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./routes/ProtectedRoutes.jsx";
import PublicRoutes from "./routes/PublicRoutes.jsx";
import BillingAndPlans from "./components/stripe/BillingAndPlans.jsx";
import { StripeWrapper } from './contexts/StripeContext';

function App() {
  return (
    <Provider store={store}>
      <StripeWrapper>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PublicRoutes />}>
              <Route path="" element={<LandingPage />} />
            </Route>
            <Route path="/login" element={<PublicRoutes />}>
              <Route path="" element={<SignupLoginPage />} />
            </Route>
            {/* Protect the dashboard route */}
            <Route path="/dashboard" element={<ProtectedRoutes />}>
              <Route path="" element={<Dashboard />} />
            </Route>
            <Route path="/billing" element={<ProtectedRoutes />}>
              <Route path="" element={<BillingAndPlans />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StripeWrapper>
    </Provider>
  );
}

export default App;