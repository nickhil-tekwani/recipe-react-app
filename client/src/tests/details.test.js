import { render, getByTestId } from "@testing-library/react";
import Details from '../components/RecipeDetails/Details';
import { MemoryRouter } from "react-router-dom";

const mockUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => {
      return mockUseNavigate;
    },
  }));

test("renders Details", () => {
    render(
        <MemoryRouter initialEntries={["/details"]}>
            <Details />
        </MemoryRouter>
    );
});

