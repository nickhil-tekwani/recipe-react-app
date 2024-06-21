import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import {
  Navigation,
  Footer,
  Home,
  Login,
  Profile,
  Details,
  Recipes,
  Recipe,
  VerifyUser
} from "./components";

const root = ReactDOM.createRoot(document.getElementById('root'));
const requestedScopes = [
  "write:review",
];

function RequireAuth({ children }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
;


// const globalState = {
//   loggedIn: true,
// };
// const globalStateContext = React.createContext(globalState);

root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
    redirectUri={`${window.location.origin}/verify-user`}
    audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    scope={requestedScopes.join(" ")}
  >
    <AuthTokenProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/verify-user" element={<VerifyUser />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/details" element={<Details />}>
            <Route path="" element={<Recipes />} />
            <Route path=":recipeSlug" element={<Recipe />} />
          </Route>

          <Route path="/profile" element={
            <RequireAuth>
              <Profile />
            </RequireAuth>} />
        </Routes>
      </Router>
    </AuthTokenProvider>
  </Auth0Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
