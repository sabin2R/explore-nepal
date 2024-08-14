import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { firestore } from '../config/firebaseConfig';
import { useRouter } from 'expo-router';
import { Destination, Itinerary } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AddItineraryScreen: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null
  );
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const snapshot = await firestore.collection('destinations').get();
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Destination[];
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, []);

  const handleAddItinerary = async () => {
    if (!selectedDestination) {
      Alert.alert('Please select a destination.');
      return;
    }

    if (startDate >= endDate) {
      Alert.alert('End date must be after start date.');
      return;
    }

    try {
      const itinerary: Itinerary = {
        destinationId: selectedDestination,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        activities: [],
      };

      await firestore.collection('itineraries').add(itinerary);
      Alert.alert('Itinerary added successfully!');
      router.push('/itinerary'); // Navigate back to itinerary list
    } catch (error) {
      Alert.alert('Error adding itinerary:', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Add New Itinerary</Text>
      </View>

      <Text style={styles.label}>Select Destination:</Text>
      <Picker
        selectedValue={selectedDestination}
        onValueChange={(itemValue) => setSelectedDestination(itemValue)}
        style={[styles.picker, {height: Platform.OS === 'ios' ?200 :50}]}
      >
        <Picker.Item label="Select a destination" value={null} />
        {destinations.map((destination) => (
          <Picker.Item
            key={destination.id}
            label={destination.name}
            value={destination.id}
          />
        ))}
      </Picker>

      <Text style={styles.label}>Start Date:</Text>
      <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
        <Text style={styles.dateButton}>{startDate.toDateString()}</Text>
      </TouchableOpacity>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartDatePicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      <Text style={styles.label}>End Date:</Text>
      <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
        <Text style={styles.dateButton}>{endDate.toDateString()}</Text>
      </TouchableOpacity>
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndDatePicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleAddItinerary}>
        <Text style={styles.addButtonText}>Add Itinerary</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 20,
    marginBottom: 20,
  },
  dateButton: {
    fontSize: 16,
    color: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddItineraryScreen;
