import { View, Text, Pressable } from 'react-native';
import tw from 'twrnc';

const Parkings = () => {
  return (
    <View style={tw`flex-1`}>
      <Pressable onPress={() => {console.log('hei'),console.log('hei')}} ><Text>Hiiiiiiiiiiiiiiiiii</Text></Pressable>
    </View>
  );
};

export default Parkings;
