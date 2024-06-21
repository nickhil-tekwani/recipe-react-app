import { render, screen } from "@testing-library/react";
import Favorites from '../components/RecipeDetails/Favorites';
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

test("renders Favorites on profile page and basic text", () => {
  render(
      <MemoryRouter initialEntries={["/profile"]}>
          <Favorites />
      </MemoryRouter>
  );
  const favString = "Your Favorite Recipes"
  expect(screen.getByText(favString, {exact: false})).toBeInTheDocument();
});

