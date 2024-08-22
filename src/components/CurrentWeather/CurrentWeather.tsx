import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import getWeatherImage, { WeatherCode } from "../../helpers/getWeatherImage";

function CurrentWeather({
  location,
  temperature,
  weathercode,
}: {
  location: string;
  temperature: number;
  weathercode: WeatherCode;
}) {
  return (
    <View style={styles.containerStyles}>
      <Text style={{ fontSize: 20, color: "white" }}>{location}</Text>
      <View style={styles.dataContainer}>
        <Text
          style={{ fontSize: 35, color: "white" }}
        >{`${temperature}°C`}</Text>
        <Image
          src={getWeatherImage(weathercode)}
          style={{ width: 100, height: 100, marginLeft: 15 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerStyles: {
    display: "flex",
    width: "95%",
    marginLeft: "auto",
    marginRight: "auto",
  },
  dataContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default CurrentWeather;
