import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { Option } from "./AutoComplete.types";

type DebounceValue<T> = T;

function useDebounce<T>(value: T, delay = 500): DebounceValue<T> {
  const [debounceValue, setDebounceValue] = useState<DebounceValue<T>>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value]);

  return debounceValue;
}

function AutoComplete({
  options,
  value,
  onSelect,
}: {
  options: Option[] | Function;
  value: Option | undefined;
  onSelect: (d: string) => void;
}) {
  const [searchValue, setSearchValue] = useState(value?.label || "");
  const [isDropDownVisible, setIsDropDownVisible] = useState(true);
  const [lazyOptions, setLazyOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const debounceValue = useDebounce(searchValue);

  useEffect(() => {
    if (typeof options === "function") {
      setLoading(true);
      options(debounceValue)
        .then((suggestions: Option[]) => {
          setLazyOptions(suggestions);
        })
        .catch((err: any) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLazyOptions(
        options.filter((option) =>
          option.label.toLowerCase().includes(debounceValue.toLowerCase())
        )
      );
    }
  }, [debounceValue]);

  const handleFocus = () => {
    setIsDropDownVisible(true);
  };

  return (
    <View style={stylesSheet.dropdownContainer}>
      <TextInput
        style={stylesSheet.textInput}
        placeholder="Type Here"
        onChangeText={(t: string) => {
          setSearchValue(t);
          setIsDropDownVisible(true);
        }}
        value={searchValue}
        onFocus={handleFocus}
        onBlur={() => setIsDropDownVisible(false)}
      />
      {isDropDownVisible && (
        <View style={stylesSheet.dropdown}>
          <FlatList
            data={lazyOptions}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item.label);
                    setIsDropDownVisible(false);
                  }}
                >
                  <Text style={{ padding: 20 }}>{item.label}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </View>
  );
}

const stylesSheet = StyleSheet.create({
  dropdownContainer: {
    position: "relative",
    zIndex: 1,
  },
  textInput: {
    padding: 10,
    width: "100%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    color: "white",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    backgroundColor: "white",
    width: "100%",
    zIndex: 100,
    maxHeight: 200,
    overflow: "hidden",
  },
});

export default AutoComplete;
