import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Divider } from "react-native-paper";

import { env } from "../../constants/env";

import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Linking } from "react-native";
import tw from "twrnc";

import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

fetchDistanceBetweenPoints = (origin, destination, setDistanceData) => {
  // Pass Latitude & Longitude of both points as a parameter
  const { latitude: lat1, longitude: lng1 } = origin;
  const { latitude: lat2, longitude: lng2 } = destination;
  var urlToFetchDistance =
    "https://maps.googleapis.com/maps/api/distancematrix/json?language=fr&units=metric&origins=" +
    lat1 +
    "," +
    lng1 +
    "&destinations=" +
    lat2 +
    "%2C" +
    lng2 +
    "&key=" +
    env.distanceMatrixKey;
  fetch(urlToFetchDistance)
    .then((res) => res.json())
    .then((res) => {
      var distance = res.rows[0].elements[0].distance.text;
      var time = res.rows[0].elements[0].duration.text;
      setDistanceData({ distance, time });
    })
    .catch((error) => {
      console.log("Problem occurred");
    });
};

export const DistanceAndTime = ({
  origin,
  destination,
  setDestination,
  ParkingInfos,
}) => {
  const [distanceLoading, setDistanceLoading] = useState(true);
  const [distanceData, setDistanceData] = useState();

  useEffect(() => {
    fetchDistanceBetweenPoints(origin, destination, setDistanceData);
  }, []);

  return (
    <View style={tw`absolute w-95% shadow-lg	  bottom-2 z-999`}>
      <View style={tw`rounded-2xl w-full flex-col bg-white  h-full  `}>
        <View style={tw`mx-auto my-3 w-11/12`}>
          <View style={tw`flex-row	justify-between	`}>
            <Text style={tw`text-center text-xl  font-bold text-[#738c94]`}>
              {ParkingInfos.name}
            </Text>
            <View style={tw` `}>
              <AntDesign
                onPress={() => {
                  setDestination(false), setDistanceLoading(true);
                }}
                name="closecircle"
                size={27}
                color="#7BE495"
              />
            </View>
          </View>
          <Divider style={tw`bg-[#9b9492] m-3`} />
          <View style={tw`justify-center `}>
            <View style={tw`flex-row	items-center pb-2`}>
              <View style={tw`bg-white shadow-md p-1	rounded-lg `}>
                <MaterialCommunityIcons
                  name="map-marker-distance"
                  size={27}
                  color="#7BE495"
                />
              </View>

              <Text
                style={tw`text-center pl-2 text-base  font-bold text-[#738c94]`}
              >
                {distanceData?.distance}
              </Text>
            </View>
            <View style={tw`flex-row	items-center	`}>
              <View style={tw`bg-white shadow-md p-1	rounded-lg`}>
                <Ionicons name="time-sharp" size={27} color="#7BE495" />
              </View>
              <Text
                style={tw`text-center pl-2 text-base  font-bold text-[#738c94]`}
              >
                {distanceData?.time}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backDrop: {},
});
