import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';

import HomeScreen from '../app/index';
// import DestinationsScreen from '../screens/DestinationsScreen';
// import MapScreen from '../screens/MapScreen';
// import ItineraryScreen from '../screens/ItineraryScreen';
// import ProfileScreen from '../screens/ProfileScreen';

type TabBarIconProps = {
    color: string;
    size: number;
};

const Tab = createBottomTabNavigator();

const getIconName = (routeName: string): keyof typeof Ionicons.glyphMap => {
    switch (routeName) {
        case 'Home':
            return 'home';
        case 'Destinations':
            return 'list';
        case 'Map':
            return 'map';
        case 'Itinerary':
            return 'calendar';
        case 'Profile':
            return 'person';
        default:
            return 'home';
    }
};

const BottomTabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }: TabBarIconProps) => {
                    const iconName = getIconName(route.name);
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            {/* <Tab.Screen name="Destinations" component={DestinationsScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Itinerary" component={ItineraryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} /> */}
        </Tab.Navigator>
    );
}

export default BottomTabNavigator;
