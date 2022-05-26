import React, { useState } from "react";
import { ActivityIndicator, Button } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { env } from "../../constants/env";
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

export const ParkingInfo = ({
  InfoModalVisible,
  ParkingInfos,
  setInfoModalVisible,
  setDestination
}) => {
  const [loadingImage, setloadingImage] = useState(true);
  const defaultImage="https://images.pexels.com/photos/933588/pexels-photo-933588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
  const Parking_Image=ParkingInfos?.photos?.[0]?.photo_reference?`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ParkingInfos.photos[0].photo_reference}&key=${env.apiKey}`:defaultImage;
  // const {geometry:{location:{lat:latitude,lng:longitude}}}=useState(ParkingInfos);

  return (
    <Modal
      style={{}}
      animationType="slide"
      transparent={true}
      visible={InfoModalVisible}
      onRequestClose={() => {setInfoModalVisible(!InfoModalVisible),setloadingImage(true)}}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {setInfoModalVisible(!InfoModalVisible),setloadingImage(true)}}
      >
          <View style={[styles.backDrop]}>
            <TouchableWithoutFeedback>
              <View
                style={tw`rounded-t-2xl w-full flex-col bg-[#3d413ef3] min-h-1/6 max-h-8/11  `}
              >
                <View style={tw`mx-auto my-3 w-11/12`}>
                  <Text style={tw`text-center text-2xl  font-bold text-white`}>
                    {ParkingInfos.name}
                  </Text>
                </View>
                <View
                  style={[
                    tw` flex-row justify-center my-2 h-3/7 w-full `,
                    styles.centeredView,
                  ]}
                >
                  <View style={[tw`justify-center  relative w-11/12 h-full`]}>
                    {loadingImage && (
                      <ActivityIndicator style={tw`m-auto`} color="green" />
                    )}
                    <Image
                      onLoad={() => setloadingImage(false)}
                      source={{ uri: Parking_Image }}
                      style={tw`absolute rounded-2xl h-full w-full`}
                    />
                  </View>
                </View>
                <View style={tw`mx-auto mt-2 mb-5  w-11/12`}>
                  <Text style={tw`font-normal text-lg	text-[#ddd5d5] `}>
                    {ParkingInfos.formatted_address}
                  </Text>
                  
                </View>
                <View style={tw`flex-row justify-evenly`}>
                  <Button
                    onPress={() => {
                      // untill we get phone numbers
                      // Linking.openURL(`tel:${ParkingInfos.PhoneNumber}`);
                    }}
                    icon={() => (
                      <Feather name="phone-call" size={24} color="white" />
                    )}
                    mode="contained"
                    color="rgb(34,197,94)"
                    labelStyle={tw`text-white`}
                  >
                    Appeler
                  </Button>
                  <Button
                    icon={() => (
                      <FontAwesome5 name="road" size={24} color="white" />
                    )}
                    onPress={()=>{
                      const {geometry:{location:{lat:latitude,lng:longitude}}}=ParkingInfos
                      setDestination({latitude,longitude})
                      setInfoModalVisible(!InfoModalVisible)
                    }}
                    mode="contained"
                    color="rgb(34,197,94)"
                    labelStyle={tw`text-white`}
                  >
                    Itiniraire
                  </Button>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backDrop: {
    justifyContent: "flex-end",
    alignItems: "center",
    height: "100%",
  },

});
