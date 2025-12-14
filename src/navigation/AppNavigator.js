// src/navigation/AppNavigator.js
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getUserRole, onAuthStateChanged, authInstance, signOut } from '../config/firebase';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

// Client Screens
import ClientHomeScreen from '../screens/client/ClientHomeScreen'
import CreateTicketScreen from '../screens/client/CreateTicketScreen';

// Developer Screens
import AdminHomeScreen from '../screens/admin/AdminHomeScreen';
import TicketDetailScreen from '../screens/admin/TicketDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Client Tab Navigator
function ClientTabs() {
    return (
        <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#3b82f6',
            tabBarInactiveTintColor: '#6b7280'
        }}
        >
        <Tab.Screen 
            name="MyTickets" 
            component={ClientHomeScreen}
            options={{ tabBarLabel: 'My Tickets' }}
        />
        <Tab.Screen 
            name="CreateTicket" 
            component={CreateTicketScreen}
            options={{ tabBarLabel: 'New Ticket' }}
        />
        </Tab.Navigator>
    );
}

// Developer Tab Navigator
function DeveloperTabs() {
    return (
        <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#3b82f6',
            tabBarInactiveTintColor: '#6b7280'
        }}
        >
        <Tab.Screen 
            name="AllTickets" 
            component={AdminHomeScreen}
            options={{ tabBarLabel: 'All Tickets' }}
        />
        </Tab.Navigator>
    );
}

// Auth Stack
function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
    );
}

// Main App Navigator
export default function AppNavigator() {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authInstance, async (authUser) => {
            try { 
                if (authUser) {

                    // get the role of the user and set to states
                    const role = await getUserRole(authUser.uid);
                    setUserRole(role);
                    setUser(authUser);
                    setError(null); // clear errors
                } else {
                    setUser(null);
                    setUserRole(null);
                    setError(null); // clear errors
                }
            } catch (err) { 
                console.error('Error fetching user role:', err);
                setError(err.message);

                // Sign out user if there's an error fetching role
                await signOut();
                setUser(null);
                setUserRole(null);
            } finally { 
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    if (loading) {
        return null; // Or a loading screen
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                // User is not logged in
                <Stack.Screen name="Auth" component={AuthStack} />
                ) : userRole === 'client' ? (
                // User is a client
                <Stack.Screen name="ClientApp" component={ClientTabs} />
                ) : userRole === 'admin' ? (
                // User is an admin
                <>
                    <Stack.Screen name="DeveloperApp" component={DeveloperTabs} />
                    <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
                </>
                ) : null}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

