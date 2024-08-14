import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { firestore } from '../../config/firebaseConfig';
import { Activity, Destination, Itinerary } from '../../navigation/types';

const { width } = Dimensions.get('window');

const ItineraryDetailScreen: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [newActivityTime, setNewActivityTime] = useState('');
  const [newActivityDescription, setNewActivityDescription] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  // Extract the itineraryId from the URL
  const itineraryId = pathname.split('/').pop();

  useEffect(() => {
    const fetchItineraryDetails = async () => {
      if (!itineraryId || itineraryId === '[id]') {
        Alert.alert('Error', 'Invalid itinerary ID');
        router.push('/itinerary');
        return;
      }

      try {
        // Fetch the itinerary document
        const itineraryDoc = await firestore.collection('itineraries').doc(itineraryId).get();
        if (itineraryDoc.exists) {
          const itineraryData = itineraryDoc.data() as Itinerary;
          setActivities(itineraryData.activities || []);

          // Fetch the destination details using the destinationId from itinerary
          const destinationDoc = await firestore
            .collection('destinations')
            .doc(itineraryData.destinationId)
            .get();
          if (destinationDoc.exists) {
            setDestination(destinationDoc.data() as Destination);
          } else {
            console.warn(`Destination not found with ID: ${itineraryData.destinationId}`);
            Alert.alert('Destination not found');
            router.push('/itinerary');
            return;
          }
        } else {
          Alert.alert('Itinerary not found');
          router.push('/itinerary');
          return;
        }
      } catch (error) {
        console.error('Error fetching itinerary details:', error);
        Alert.alert('Error fetching itinerary details:', error.message);
      }
    };

    fetchItineraryDetails();
  }, [itineraryId]);

  const handleAddActivity = async () => {
    if (!newActivityTime || !newActivityDescription) {
      Alert.alert('Please enter both time and description for the activity.');
      return;
    }

    const newActivity: Activity = {
      time: newActivityTime,
      description: newActivityDescription,
    };

    try {
      const updatedActivities = [...activities, newActivity];
      await firestore.collection('itineraries').doc(itineraryId).update({
        activities: updatedActivities,
      });
      setActivities(updatedActivities);
      setNewActivityTime('');
      setNewActivityDescription('');
      Alert.alert('Activity added successfully!');
    } catch (error) {
      console.error('Error adding activity:', error);
      Alert.alert('Error adding activity:', error.message);
    }
  };

  const handleDeleteActivity = async (index: number) => {
    const updatedActivities = activities.filter((_, i) => i !== index);
    try {
      await firestore.collection('itineraries').doc(itineraryId).update({
        activities: updatedActivities,
      });
      setActivities(updatedActivities);
    } catch (error) {
      console.error('Error deleting activity:', error);
      Alert.alert('Error deleting activity:', error.message);
    }
  };

  if (!destination) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading itinerary details...</Text>
      </SafeAreaView>
    );
  }

  const renderItem = ({ item, index }: { item: Activity; index: number }) => (
    <View style={styles.activityCard}>
      <Text style={styles.activityTime}>{item.time}</Text>
      <Text style={styles.activityDescription}>{item.description}</Text>
      <TouchableOpacity onPress={() => handleDeleteActivity(index)} style={styles.deleteButton}>
        <Ionicons name="trash" size={20} color="#ff0000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>{destination.name}</Text>
      </View>
      <Image source={{ uri: destination.imageUrl }} style={styles.image} />
      <Text style={styles.header}>Schedule</Text>
      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.contentContainer}
      />
      <View style={styles.addActivityContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter time (e.g., 8:00 AM)"
          placeholderTextColor="#888" 
          value={newActivityTime}
          onChangeText={setNewActivityTime}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter activity description"
          placeholderTextColor="#888" 
          value={newActivityDescription}
          onChangeText={setNewActivityDescription}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddActivity}>
          <Text style={styles.addButtonText}>Add Activity</Text>
        </TouchableOpacity>
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
    marginBottom: 10,
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
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  contentContainer: {
    paddingVertical: 10,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  activityTime: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    width: 80,
    color: '#555',
  },
  activityDescription: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  deleteButton: {
    padding: 5,
  },
  addActivityContainer: {
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ItineraryDetailScreen;
