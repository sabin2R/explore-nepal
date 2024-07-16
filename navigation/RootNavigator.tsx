// import React, { useState, useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import AuthStack from './AuthStack';
// import MainAppStack from './MainAppStack';
// import { auth } from '../config/firebaseConfig';

// const RootNavigator: React.FC = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(false);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       setIsLoggedIn(!!user);
//     });
//     return unsubscribe;
//   }, []);

//   if (isLoggedIn === null) {
//     return null; // or a loading spinner
//   }

//   return (
//     <NavigationContainer>
//       {isLoggedIn ? <MainAppStack /> : <AuthStack />}
//     </NavigationContainer>
//   );
// };

// export default RootNavigator;
