import React from "react";
import { render } from "@testing-library/react-native";
import WeeklyDetails from "../src/components/WeekDetails/WeekDetails";
import getWeatherImage, { WeatherCode } from "../src/helpers/getWeatherImage";

// Mock the getWeatherImage function
jest.mock("../src/helpers/getWeatherImage");

describe("WeeklyDetails Component", () => {
  const mockForecast: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    time: string[];
    weathercode: WeatherCode[];
  } = {
    temperature_2m_max: [30, 31, 29, 28, 27, 26, 25],
    temperature_2m_min: [20, 21, 19, 18, 17, 16, 15],
    time: [
      "2024-08-22",
      "2024-08-23",
      "2024-08-24",
      "2024-08-25",
      "2024-08-26",
      "2024-08-27",
      "2024-08-28",
    ],
    weathercode: ["0", "1", "2", "3", "45", "48", "51"],
  };

  beforeEach(() => {
    // Mock return value of getWeatherImage
    (getWeatherImage as jest.Mock).mockReturnValueOnce("mocked-image-src");
  });

  it("should render correctly", () => {
    const { getByText, getAllByText, getAllByRole } = render(
      <WeeklyDetails weeklyForecast={mockForecast} />
    );

    // Check that "Today" is rendered correctly
    expect(getByText("Today")).toBeTruthy();

    // Check that the correct days of the week are rendered
    expect(getByText("Friday")).toBeTruthy(); // Assuming today is Thursday
    expect(getByText("Saturday")).toBeTruthy();
    expect(getByText("Sunday")).toBeTruthy();

    // Check that temperature values are rendered correctly
    expect(getAllByText("30°").length).toBe(1);
    expect(getAllByText("20°").length).toBe(1);
  });

  it("should call getWeatherImage function for each day", () => {
    render(<WeeklyDetails weeklyForecast={mockForecast} />);

    // Ensure getWeatherImage is called 7 times, once for each day
    expect(getWeatherImage).toHaveBeenCalledTimes(14);

    // Verify that getWeatherImage was called with the correct weather codes
    expect(getWeatherImage).toHaveBeenCalledWith("0");
    expect(getWeatherImage).toHaveBeenCalledWith("1");
    expect(getWeatherImage).toHaveBeenCalledWith("2");
    expect(getWeatherImage).toHaveBeenCalledWith("3");
    expect(getWeatherImage).toHaveBeenCalledWith("45");
    expect(getWeatherImage).toHaveBeenCalledWith("48");
    expect(getWeatherImage).toHaveBeenCalledWith("51");
  });
});
