import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import Home from './components/Home'
import VerifyUser from './components/VerifyUser'
import AppLayout from './components/AppLayout'
import Profile from './components/Profile'
import NotFound from './components/NotFound'

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
const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return <button onClick={() => loginWithRedirect()}>Log In</button>;
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button onClick={() => logout({ returnTo: window.location.origin })}>
      Log Out
    </button>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={`${window.location.origin}/verify-user`}
      audience={process.env.REACT_APP_AUTH0_AUDIENCE}
      scope={requestedScopes.join(" ")}
    >
      <AuthTokenProvider>
        <LoginButton />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify-user" element={<VerifyUser />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="app"
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            >
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);


// root.render(
//     <React.StrictMode>
//       <Router>
//       <Navigation />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/details" element={<Details />}>
//           <Route path="" element={<Recipes />} />
//           <Route path=":recipeSlug" element={<Recipe />} />
//         </Route>
//       </Routes>
//     </Router>
//     </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();
