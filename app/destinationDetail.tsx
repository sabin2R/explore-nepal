import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TextInput, Button, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { firestore, auth } from '../config/firebaseConfig';
import { Destination } from '../navigation/types';
import firebase from 'firebase/compat/app';

const DestinationDetailScreen: React.FC = () => {
  const { destination } = useLocalSearchParams();
  const [parsedDestination, setParsedDestination] = useState<Destination | null>(null);
  const [tips, setTips] = useState<any[]>([]);
  const [newTip, setNewTip] = useState<string>('');

  useEffect(() => {
    if (destination) {
      try {
        const parsedData = JSON.parse(destination as string) as Destination;
        setParsedDestination(parsedData);
      } catch (error) {
        Alert.alert('Error', 'Invalid destination data.');
      }
    }
  }, [destination]);

  useEffect(() => {
    if (parsedDestination) {
      const fetchTips = async () => {
        try {
          const snapshot = await firestore.collection('destinations').doc(parsedDestination.id).collection('tips').orderBy('timestamp', 'desc').get();
          const fetchedTips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setTips(fetchedTips);
        } catch (error) {
          Alert.alert('Error', 'Failed to fetch tips.');
        }
      };

      fetchTips();
    }
  }, [parsedDestination]);

  const handleAddTip = async () => {
    if (newTip.trim() === '') {
      Alert.alert('Error', 'Tip cannot be empty.');
      return;
    }

    try {
      const tip = {
        text: newTip,
        userId: auth.currentUser?.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      };
      await firestore.collection('destinations').doc(parsedDestination?.id).collection('tips').add(tip);
      setNewTip('');
      // Fetch updated tips
      const snapshot = await firestore.collection('destinations').doc(parsedDestination?.id).collection('tips').orderBy('timestamp', 'desc').get();
      const updatedTips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTips(updatedTips);
    } catch (error) {
      Alert.alert('Error', 'Failed to add tip.');
    }
  };

  const handleDeleteTip = async (tipId: string) => {
    try {
      await firestore.collection('destinations').doc(parsedDestination?.id).collection('tips').doc(tipId).delete();
      // Fetch updated tips
      const snapshot = await firestore.collection('destinations').doc(parsedDestination?.id).collection('tips').orderBy('timestamp', 'desc').get();
      const updatedTips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTips(updatedTips);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete tip.');
    }
  };

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
      <Text style={styles.subTitle}>How to Reach</Text>
      <Text style={styles.description}>{parsedDestination.howToReach}</Text>
      <Text style={styles.subTitle}>Tips</Text>
      <Text style={styles.description}>{parsedDestination.tips}</Text>

      <View style={styles.tipInputContainer}>
        <TextInput
          style={styles.tipInput}
          placeholder="Leave a tip..."
          value={newTip}
          onChangeText={setNewTip}
        />
        <Button title="Add Tip" onPress={handleAddTip} />
      </View>

      {tips.map(tip => (
        <View key={tip.id} style={styles.tipContainer}>
          <Text style={styles.tipText}>{tip.text}</Text>
          {tip.userId === auth.currentUser?.uid && (
            <Button title="Delete" onPress={() => handleDeleteTip(tip.id)} />
          )}
        </View>
      ))}
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
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  tipInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  tipInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 16,
    flex: 1,
  },
});

export default DestinationDetailScreen;
