import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, Platform } from 'react-native';
import { firestore } from '../../config/firebaseConfig';
import { Destination } from '../../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import remoteConfig from '@react-native-firebase/remote-config';

let MapView: any;
let Marker: any;

if (Platform.OS === 'web') {
  MapView = require('react-native-web-maps').default;
  Marker = require('react-native-web-maps').Marker;
} else {
  MapView = require('react-native-maps').default;
  Marker = require('react-native-maps').Marker;
}

const { width, height } = Dimensions.get('window');

const MapScreen: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const fetchApiKey = async () => {
      await remoteConfig().setDefaults({
        google_maps_api_key: '',
      });
      await remoteConfig().fetchAndActivate();
      const key = remoteConfig().getValue('google_maps_api_key').asString();
      setApiKey(key);
    };

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

    fetchApiKey();
    fetchDestinations();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS === 'web' ? (
        <MapView
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${apiKey}`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        >
          {destinations.map(destination => (
            <Marker
              key={destination.id}
              position={{
                lat: destination.location.latitude,
                lng: destination.location.longitude,
              }}
              title={destination.name}
              description={destination.description}
            />
          ))}
        </MapView>
      ) : (
        <MapView style={styles.map}>
          {destinations.map(destination => (
            <Marker
              key={destination.id}
              coordinate={{
                //latitude: destination.location.latitude,
                //longitude: destination.location.longitude,
              }}
              title={destination.name}
              description={destination.description}
            />
          ))}
        </MapView>
      )}
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
