import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ImageBackground, FlatList, Pressable, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { firestore } from '../../config/firebaseConfig';
import CategoryIcon from '../../components/CategoryIcon';
import globalStyles from '../../styles/globalStyles';
import { Destination } from '../../navigation/types';
import firebase from 'firebase/compat/app';

const {width} = Dimensions.get('window')

const HomeScreen: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = firebase.auth().currentUser;
        if (user) {
          const userDoc = await firestore.collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            setUserName(userDoc.data()?.name || 'User');
          }
        }
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };
    
    const fetchDestinations = async () => {
      try {
        const snapshot = await firestore.collection('destinations').get();
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Destination[];
        const shuffled = data.sort(() => 0.5 - Math.random());
        setDestinations(shuffled.slice(0, 5));
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserName();
    fetchDestinations();
  }, []);

  const renderItem = ({ item }: { item: Destination }) => (
    <Pressable onPress={() => router.push(`/destinationDetail?destination=${encodeURIComponent(JSON.stringify(item))}`)}>
      <View style={styles.destinationCard}>
        <ImageBackground source={{ uri: item.imageUrl }} style={styles.destinationImage} />
        <View style={styles.destinationTextContainer}>
          <Text style={styles.destinationName}>{item.name}</Text>
          {/* <Text style={styles.destinationDescription}>{item.description.substring(0, 50)}...</Text> */}
          <Ionicons name="chevron-forward" size={16} color="black" style={styles.chevronIcon} />
        </View>
      </View>
    </Pressable>
  );

  const ListHeaderComponent = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi {userName}!</Text>
        <Ionicons name="notifications-outline" size={24} color="black" style={styles.notificationIcon} />
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search your destination"
      />
      <Text style={styles.sectionTitle}>Categories</Text>
      <View style={styles.categoriesContainer}>
        <View style={styles.categoryCard}>
          <CategoryIcon icon={require('../../assets/icons/Historical.png')} label="Historical" />
        </View>
        <View style={styles.categoryCard}>
          <CategoryIcon icon={require('../../assets/icons/Adventure.png')} label="Adventure" />
        </View>
        <View style={styles.categoryCard}>
          <CategoryIcon icon={require('../../assets/icons/Nature.png')} label="Nature" />
        </View>
      </View>
      <Text style={styles.sectionTitle}>Featured Destination</Text>
    </>
  );

  return (
    <View style={globalStyles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={destinations}
          numColumns={width > 600? 3:2}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={styles.featuredScrollContainer}
          columnWrapperStyle={width > 600 ? styles.columnWrapper : null}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  greeting: {
    fontSize: width > 600? 30:24,
    fontWeight: 'bold',
  },
  notificationIcon: {
    marginRight: 10,
  },
  searchBar: {
    // fontSize:10,
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginBottom: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    // width: width / 3.5,
    alignItems: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: width > 600 ? 22: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  destinationCard: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    width:width > 600? 250:200 ,
    alignItems: 'center',
  },
  destinationImage: {
    width: '100%',
    height: width > 600? 200:150,
  },
  destinationTextContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  destinationName: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  destinationDescription: {
    fontSize: 12,
    color: '#666',
    flex: 2,
  },
  chevronIcon: {
    marginLeft: 10,
  },
  featuredScrollContainer: {
    paddingHorizontal: 10,
  },
  columnWrapper: {
    justifyContent: 'space-around',
  },
});

export default HomeScreen;
