import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { firestore } from '../../config/firebaseConfig';
import { Destination } from '../../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const MapScreen: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const snapshot = await firestore.collection('destinations').get();
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Destination[];
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView style={styles.map}>
        {destinations.map(destination => (
          <Marker
            key={destination.id}
            coordinate={{
              latitude: destination.location.latitude,
              longitude: destination.location.longitude,
            }}
            title={destination.name}
            description={destination.description}
          />
        ))}
      </MapView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapScreen;
