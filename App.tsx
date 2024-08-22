import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TextInput, Button } from "react-native";
import axios from "axios";

import WeeklyDetails from "./src/components/WeekDetails/WeekDetails";
import CurrentWeather from "./src/components/CurrentWeather/CurrentWeather";
import AutoComplete from "./src/components/AutoComplete/AutoComplete";

const API_URL = "https://api.open-meteo.com/v1/forecast";
const GEO_API_URL = "https://geocoding-api.open-meteo.com/v1/search?name=";

const App = () => {
  const [location, setLocation] = useState("Berlin");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weeklyForecast, setWeeklyForecast] = useState<any>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWeather(location);
  }, [location]);

  const fetchWeather = async (locationName: string) => {
    try {
      // Fetch geocoding data
      const geoResponse = await axios.get(`${GEO_API_URL}${locationName}`);
      const { latitude, longitude } = geoResponse.data.results[0];

      // Fetch weather data
      const weatherResponse = await axios.get(
        `${API_URL}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&current_weather=true&timezone=auto`
      );
      const data = weatherResponse.data;
      setWeatherData(data.current_weather);
      setWeeklyForecast(data.daily);
    } catch (err) {
      setError("Location not found. Please try again.");
    }
  };

  const handleSearch = () => {
    if (query) {
      setLocation(query);
      setQuery("");
      setError("");
    }
  };

  const getOptions = async (query: string) => {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${query}`
    );
    const data = await response.json();
    return data.results.map((res: any) => ({
      label: res.name,
      value: res.name,
    }));
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#ff66ff",
      }}
    >
      <View style={{ width: "95%", marginLeft: "auto", marginRight: "auto" }}>
        <Text
          style={{
            fontSize: 24,
            textAlign: "center",
            color: "white",
            marginBottom: 20,
          }}
        >
          Weather Watch
        </Text>
        <AutoComplete
          options={getOptions}
          value={undefined}
          onSelect={setLocation}
        />
      </View>

      {error ? (
        <Text style={{ color: "red" }}>{error}</Text>
      ) : weatherData ? (
        <View style={{ marginTop: 200 }}>
          <CurrentWeather
            location={location}
            temperature={weatherData.temperature}
            weathercode={weatherData.weathercode}
          />
          <WeeklyDetails weeklyForecast={weeklyForecast} />
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
};

export default App;
