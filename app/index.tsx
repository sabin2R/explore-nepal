import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import DestinationCard from '../components/DestinationCard';
import globalStyles from '../styles/globalStyles';

const HomeScreen: React.FC = () => {
  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Explore Nepal</Text>
        <TextInput
          style={globalStyles.searchBar}
          placeholder="Search destinations..."
        />
      </View>
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Categories</Text>
        <View style={globalStyles.categories}>
          <Text style={globalStyles.category}>Historical</Text>
          <Text style={globalStyles.category}>Adventure</Text>
          <Text style={globalStyles.category}>Nature</Text>
        </View>
      <View style={globalStyles.section}>
        <Text style={globalStyles.sectionTitle}>Featured Destinations</Text>
        <ScrollView horizontal>
          <DestinationCard />
          <DestinationCard />
          <DestinationCard />
        </ScrollView>
      </View>
      
      </View>
    </ScrollView>
  );
}

export default HomeScreen;
