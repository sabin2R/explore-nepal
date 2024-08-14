import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { firestore } from '../../config/firebaseConfig';
import { Itinerary, Destination } from '../../navigation/types';

const EditItineraryScreen: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(
    null
  );
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const itineraryId = pathname.split('/').pop(); // Extract itinerary ID from URL

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

    const fetchItinerary = async () => {
      try {
        const doc = await firestore.collection('itineraries').doc(itineraryId).get();
        if (doc.exists) {
          const itineraryData = doc.data() as Itinerary;
          setItinerary(itineraryData);
          setSelectedDestination(itineraryData.destinationId);
          setStartDate(new Date(itineraryData.startDate));
          setEndDate(new Date(itineraryData.endDate));
        } else {
          Alert.alert('Itinerary not found');
          router.push('/itinerary');
        }
      } catch (error) {
        console.error('Error fetching itinerary:', error);
      }
    };

    fetchDestinations();
    fetchItinerary();
  }, [itineraryId]);

  const handleUpdateItinerary = async () => {
    if (!selectedDestination) {
      Alert.alert('Please select a destination.');
      return;
    }

    if (startDate >= endDate) {
      Alert.alert('End date must be after start date.');
      return;
    }

    try {
      await firestore.collection('itineraries').doc(itineraryId).update({
        destinationId: selectedDestination,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      Alert.alert('Itinerary updated successfully!');
      router.push('/itinerary'); // Navigate back to itinerary list
    } catch (error) {
      Alert.alert('Error updating itinerary:', error.message);
    }
  };

  if (!itinerary) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading itinerary details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Itinerary</Text>
      </View>

      <Text style={styles.label}>Select Destination:</Text>
      <Picker
        selectedValue={selectedDestination}
        onValueChange={(itemValue) => setSelectedDestination(itemValue)}
        style={[styles.picker, { height: Platform.OS === 'ios' ? 200 : 50 }]}
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
      <Button
        title={startDate.toDateString()}
        onPress={() => setShowStartDatePicker(true)}
      />
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
      <Button
        title={endDate.toDateString()}
        onPress={() => setShowEndDatePicker(true)}
      />
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

      <View style={styles.buttonContainer}>
        <Button title="Update Itinerary" onPress={handleUpdateItinerary} />
      </View>
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
  loadingText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
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
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default EditItineraryScreen;
