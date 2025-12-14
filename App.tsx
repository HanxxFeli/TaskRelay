// MAIN ENTRY POINT - This is where the app starts

import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * Root App Component
 * @returns {JSX.Element} The entire app wrapped in navigation
 * @description Reenders AppNavigator which will handle all the screens
 */
export default function App() {
    return <AppNavigator />;
}