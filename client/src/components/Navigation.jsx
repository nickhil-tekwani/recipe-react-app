import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
function Navigation() {


  const { loginWithRedirect, user, isLoading, logout, isAuthenticated } = useAuth0();

  const LoginButton = () => {

    return <li className="nav-item">
      <NavLink className="nav-link" to="" onClick={() => loginWithRedirect()}>
        Login
      </NavLink>
    </li>

  };

  const RegistrationButton = () => {

    return <li className="nav-item">
      <NavLink className="nav-link" to="" onClick={() => loginWithRedirect({
        screen_hint: 'signup',
      })}>
        Registration
      </NavLink>
    </li >

  };

  const LogoutButton = () => {
    const { logout } = useAuth0();
    return (
      <li className="nav-item">
        <NavLink className="nav-link" to="" onClick={() => logout({ returnTo: window.location.origin })}>
          Logout
        </NavLink>
      </li >


    );
  }

  return (
    <div className="navigation">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container" style={{ flexWrap: 'wrap' }}>
          <NavLink className="navbar-brand" to="/">
            Online Recipe Book
          </NavLink>
          <div>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                  <span className="sr-only">(current)</span>
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/details">
                  Recipes
                </NavLink>
              </li>
              {isAuthenticated &&
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/profile">
                      Profile
                    </NavLink>
                  </li>
                  <LogoutButton />
                </>}

              {
                !isAuthenticated &&
                <>
                  <LoginButton />
                  <RegistrationButton />
                </>
              }
              {/* 
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">
                  Login
                </NavLink>
              </li> */}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
