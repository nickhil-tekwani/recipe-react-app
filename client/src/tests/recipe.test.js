import { render, screen } from "@testing-library/react";
import Recipe from '../components/RecipeDetails/Recipe';
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

test("renders a Recipe and basic text", () => {
  render(
      <MemoryRouter initialEntries={["/details/1096250"]}>
          <Recipe />
      </MemoryRouter>
  );
  const instrString = "Instructions"
  expect(screen.getByText(instrString, {exact: false})).toBeInTheDocument();
});

