import React from "react";
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from "react-native";
import getWeatherImage, { WeatherCode } from "../../helpers/getWeatherImage";

const styles = StyleSheet.create({
  container: {
    width: "95%",
    padding: 15,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 10,
    marginLeft: "auto",
    marginRight: "auto",
  },
  dayContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayDetailsContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function WeeklyDetails({
  weeklyForecast,
}: {
  weeklyForecast: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    time: string[];
    weathercode: WeatherCode[];
  };
}) {
  const renderItem = ({ item, index }: { index: number; item: number }) => {
    return (
      <View style={styles.dayContainer}>
        <Text style={{ flex: 1, color: "white", fontWeight: "bold" }}>
          {index === 0
            ? "Today"
            : daysOfWeek[new Date(weeklyForecast.time[index]).getDay()]}
        </Text>
        <View style={styles.dayDetailsContainer}>
          <View style={{ flex: 1 }}>
            <Image
              src={getWeatherImage(weeklyForecast.weathercode[index])}
              style={{ width: 50, height: 50 }}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ marginLeft: 10, color: "white" }}>{`${item}°`}</Text>
            <Text
              style={{ marginLeft: 10, color: "white" }}
            >{`${weeklyForecast.temperature_2m_min[index]}°`}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={weeklyForecast.temperature_2m_max}
        renderItem={renderItem}
      />
    </View>
  );
}

export default WeeklyDetails;
