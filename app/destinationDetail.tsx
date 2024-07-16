import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Destination } from '../navigation/types';

const DestinationDetailScreen: React.FC = () => {
  const { destination } = useLocalSearchParams();

  let parsedDestination: Destination | null = null;
  try {
    parsedDestination = destination ? JSON.parse(destination as string) : null;
  } catch (error) {
    Alert.alert('Error', 'Invalid destination data.');
  }

  if (!parsedDestination) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Unable to load destination details.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: parsedDestination.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{parsedDestination.name}</Text>
      <Text style={styles.description}>{parsedDestination.description}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default DestinationDetailScreen;
