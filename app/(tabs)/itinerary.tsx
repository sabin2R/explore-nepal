import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ItineraryScreen: React.FC = () => {
  const [itinerary, setItinerary] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim() === '') {
      Alert.alert('Error', 'Please enter an activity or destination.');
      return;
    }
    setItinerary([...itinerary, newItem]);
    setNewItem('');
  };

  const removeItem = (index: number) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Itinerary</Text>
      <FlatList
        data={itinerary}
        renderItem={({ item, index }) => (
          <View style={styles.itineraryItem}>
            <Text style={styles.itemText}>{item}</Text>
            <TouchableOpacity onPress={() => removeItem(index)}>
              <Ionicons name="trash" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new activity or destination"
          value={newItem}
          onChangeText={setNewItem}
        />
        <TouchableOpacity onPress={addItem} style={styles.addButton}>
          <Ionicons name="add-circle" size={40} color="green" />
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
  title: {
    fontSize: width > 600 ? 30 : 24, // Adjust font size based on screen width
    fontWeight: 'bold',
    marginBottom: 20,
  },
  list: {
    flexGrow: 1,
    marginBottom: 20,
  },
  itineraryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  itemText: {
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ItineraryScreen;
