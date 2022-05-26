import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import axios from "axios";

import LottieView from "lottie-react-native";

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { SIZES } from "../constants/theme";
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
import { Button, Icon } from "react-native-elements";
import { ParkingInfo } from "../components/modals/ParkingInfo";
import { DistanceAndTime } from "../components/modals/DistanceAndTime";
import { env } from "../constants/env";
import tw from "twrnc";

const fetchData = async (location, setParkings) => {
  try {
    if (Object.keys(location).length !== 0) {
      const {
        coords: { latitude: lat, longitude: lon },
      } = location;
      const locationData = { lon, lat, distance: 15000 };
      const  {data:{results}} = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=parking%20in%20safi&key=${env.apiKey}`);
      setParkings(results);
      console.log(results);
    }
  } catch (error) {
    // enter your logic for when there is an error (ex. error toast)
    console.log(`error: `, error);
  }
};
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

export default function Home() {
  //location state
  const [location, setLocation] = useState(null);

  const [errorMsg, setErrorMsg] = useState(null);
  const [destination, setDestination] = useState(null);
  const [OldLocation, setOldLocation] = useState(null);

  //pharamcies states
  const [Parkings, setParkings] = useState(null);
  const [InfoModalVisible, setInfoModalVisible] = useState(false);
  // const [DistanceModalVisible, setDistanceModalVisible] = useState(false);
  const [ParkingInfos, SetParkingInfos] = useState({});
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      // get the user coords
      let location = await Location.getCurrentPositionAsync({});
      // get the user location
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          //60s*5=300s == 5m == 300000ms
          // timeInterval: 0,
          distanceInterval: 1,
        },
        (loc) => {
          setLocation(loc);
        }
      );})();
    // fetchData();
    return () => {
    };
  }, []);

  useEffect(() => {
    if (location) {
      if (!OldLocation) {
        setOldLocation(location);
        fetchData(location, setParkings);
      } else {
        const distance = getDistanceFromLatLonInKm(
          location.coords.latitude,
          location.coords.longitude,
          OldLocation.coords.latitude,
          OldLocation.coords.longitude
        );
        console.log("distance: ",distance);
        if(distance>0.015){
          setOldLocation(location);
          fetchData(location, setParkings);
        }
      }
    }
  }, [location]);
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {location?.coords && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
              ...location.coords,
            }}
          >
            {
              //show itineraire line
              destination && location?.coords && (
                <MapViewDirections
                  origin={location.coords}
                  destination={destination}
                  apikey={env.routesKey}
                  strokeWidth={5}
                  strokeColor="green"
                />
              )
            }

            {
              //all Parkings
              Parkings?.map((e, i) => {
                const { lat: latitude, lng: longitude } = e.geometry.location;
                return (
                  <Marker
                    onPress={() => {
                      SetParkingInfos(e),
                        setInfoModalVisible(!InfoModalVisible);
                    }}
                    key={i}
                    coordinate={{ latitude, longitude }}
                    // title={e.name}
                    // description={"Pharmacy"}
                  >
                    <Image
                      source={require("../../assets/png/motor-icon.png")}
                      style={{ height: 45, width: 45 }}
                    />
                  </Marker>
                );
              })
            }
            {location?.coords && (
              <Marker
                tracksViewChanges={false}
                coordinate={location.coords}
                title={"me"}
              >
                <MaterialIcons
                  name="assistant-navigation"
                  size={40}
                  color="#e24d11"
                />
              </Marker>
            )}
          </MapView>
        )}

        <ParkingInfo
          setDestination={setDestination}
          ParkingInfos={ParkingInfos}
          InfoModalVisible={InfoModalVisible}
          setInfoModalVisible={setInfoModalVisible}
        />
        {
          //show itineraire line
          destination && location?.coords && (
            <DistanceAndTime
              ParkingInfos={ParkingInfos}
              setDestination={setDestination}
              origin={location.coords}
              destination={destination}
            />
          )
        }
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: SIZES.width,
    height: SIZES.height,
  },
});
