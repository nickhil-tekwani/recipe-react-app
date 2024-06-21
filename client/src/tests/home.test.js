import { render, screen } from "@testing-library/react";
import Home from '../components/Home';
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

let mockIsAuthenticated = false;
const mockLoginWithRedirect = jest.fn();
const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => {
      return mockUseNavigate;
    },
  }));

test("renders Home and basic text", () => {
  render(
      <MemoryRouter initialEntries={["/"]}>
          <Home />
      </MemoryRouter>
  );
  const homeString = "Welcome to your one-stop-shop"
  expect(screen.getByText(homeString, {exact: false})).toBeInTheDocument();
});

