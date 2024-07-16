import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../config/firebaseConfig';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const ProfileScreen: React.FC = () => {
  const userName = auth.currentUser?.displayName || "User"; // Replace with dynamic user data
  const userEmail = auth.currentUser?.email || "user@example.com"; // Replace with dynamic user data

  const handleLogout = async () => {
    try {
      await auth.signOut();
      Alert.alert('Logout', 'You have been logged out.');
      router.replace('/(auth)/Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        <Image source={{ uri: auth.currentUser?.photoURL || 'https://placekitten.com/200/200' }} style={styles.profileImage} />
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
      </View>
      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications-outline" size={24} color="black" />
          <Text style={styles.settingText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="settings-outline" size={24} color="black" />
          <Text style={styles.settingText}>Preferences</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="red" />
          <Text style={[styles.settingText, { color: 'red' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  profileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  userName: {
    fontSize: width > 600 ? 24 : 20, 
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: width > 600 ? 18 : 16, 
    color: '#666',
  },
  settingsContainer: {
    flex: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  settingText: {
    marginLeft: 10,
    fontSize: 18,
  },
});

export default ProfileScreen;
