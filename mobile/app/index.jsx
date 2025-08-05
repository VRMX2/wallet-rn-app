import { Text, View } from "react-native";
import {Link} from 'expo-router'
export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
		<Text>Edit app/index.tsx to edit this screen.</Text>
      <Link href="/about" style={{fontSize:13,fontWeight:"bold",color:"white",backgroundColor:"black"}}>go to about</Link>
    </View>
  );
}
