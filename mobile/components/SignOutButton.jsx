import { useClerk } from '@clerk/clerk-expo';
import { Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  
  const handleSignOut = async () => {
    Alert.alert(
      "Logout", 
      "Are you sure you want to logout?", 
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => signOut() }
      ]
    );
  };

  return (
    <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
      <Ionicons name="log-out-outline" size={20} color={COLORS.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
	shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  }
});