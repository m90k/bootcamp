import React from 'react';
import { useSelector } from 'react-redux';
import { StatusBar } from 'react-native';

import createRoutes from './routes';
import navigation from './services/navigation';

export default function App() {
  const signed = useSelector(state => state.auth.signed);
  const Routes = createRoutes(signed);

  return (
    <>
      <StatusBar
        backgroundColor={signed ? '#18161f' : '#22202C'}
        barStyle="light-content"
      />
      <Routes
        ref={navigatorRef => {
          navigation.setNavigator(navigatorRef);
        }}
      />
    </>
  );
}
