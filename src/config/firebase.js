// FIREBASE CONFIGURATION AND HELPER FUNCTIONS
// This file contains all the functions needed to interact with Firebase

import auth, { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from '@react-native-firebase/auth';

import firestore from '@react-native-firebase/firestore';
import Config from 'react-native-config';

import firestore, {
    collection,
    doc,
    getDoc,
    setDoc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp
} from '@react-native-firebase/firestore';

// Create Firebase instances
const authInstance = auth();
const firestoreInstance = firestore();

/**
 * Creates a new user account and stores user info in Firestore
 * @param {string} email - User's email address
 * @param {string} password - User's password (min 6 characters)
 * @param {string} name - User's full name
 * @param {string} role - User's role ('client' or 'admin')
 * @returns {Promise<object>} Firebase user object
 * @throws {Error} If account creation or Firestore write fails
 */
export const signUp = async (email, password, name, role) => {
    try {
        // Validate inputs
        if (!email || !password || !name || !role) {
        throw new Error('All fields are required');
        }
        if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
        }
        if (!['client', 'admin'].includes(role)) {
        throw new Error('Role must be either "client" or "admin"');
        }

        // Create authentication account
        const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
        const user = userCredential.user;

        // Save additional user info to Firestore database
        const userRef = doc(firestoreInstance, 'users', user.uid);
        await setDoc(userRef, {
            email,
            name,
            role,
            createdAt: serverTimestamp()
        });

        // verification for user doc creation 
        const verifyDoc = await getDoc(userRef);
        if (!verifyDoc.exists()) {
            throw new Error('Failed to create user profile');
        }

        return user;
    } catch (error) {
        // Re-throw with more context
        throw new Error(error.message || 'Failed to create account');
    }
};

/**
 * Signs in an existing user
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<object>} Firebase user object
 * @throws {Error} If authentication fails
 */
export const signIn = async (email, password) => {
    try {
        if (!email || !password) {
        throw new Error('Email and password are required');
        }

        const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
        return userCredential.user;
    } catch (error) {
        // Provide user-friendly error messages
        if (error.code === 'auth/user-not-found') {
        throw new Error('No account found with this email');
        } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password');
        } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
        }
        throw new Error(error.message || 'Failed to sign in');
    }
};

/**
 * Signs out the current user
 * @returns {Promise<void>}
 * @throws {Error} If sign out fails
 */
export const signOut = async () => {
    try {
        await firebaseSignOut(authInstance);
    } catch (error) {
        throw new Error('Failed to sign out');
    }
};

/**
 * Gets the currently logged in user
 * @returns {object|null} Current user object or null if not logged in
 */
export const getCurrentUser = () => {
    return authInstance.currentUser;
};

/**
 * Retrieves the role of a specific user from Firestore
 * @param {string} userId - The user's unique ID
 * @returns {Promise<string>} User's role ('client' or 'admin')
 * @throws {Error} If user document doesn't exist or fetch fails
 */
export const getUserRole = async (userId, retries = 3) => {
    try {
        if (!userId) {
            throw new Error('User ID is required');
        }

        const userRef = doc(firestoreInstance, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
            if (retries > 0) {
                console.log(`User doc not found, retrying... (${retries} attempts left)`);
                await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms
                return getUserRole(userId, retries - 1); // Retry
            }
            throw new Error('User profile not found');
        }

        const userData = userDoc.data();
        if (!userData || !userData.role) {
        throw new Error('User role not found');
        }

        return userData.role;
    } catch (error) {
        throw new Error(error.message || 'Failed to get user role');
    }
};

/**
 * Creates a new ticket in Firestore
 * @param {string} title - Brief title of the ticket
 * @param {string} description - Detailed description of the issue/request
 * @param {string} type - Type of ticket ('bug' or 'feature')
 * @returns {Promise<string>} The ID of the created ticket
 * @throws {Error} If ticket creation fails or user not authenticated
 */
export const createTicket = async (title, description, type) => {
    try {
        const currentUser = authInstance.currentUser;
        
        if (!currentUser) {
            throw new Error('You must be logged in to create a ticket');
        }

        // Validate inputs
        if (!title || !description || !type) {
            throw new Error('All fields are required');
        }
        if (!['bug', 'feature'].includes(type)) {
            throw new Error('Type must be either "bug" or "feature"');
        }

        let clientName = currentUser.email; // Default fallback
        
        try {
            const userDoc = await firestoreInstance
                .collection('users')
                .doc(currentUser.uid)
                .get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                clientName = userData.name || currentUser.email;
            }
        } catch (err) {
            console.log('Could not fetch user name, using email instead:', err);
        }

        // Create the ticket
        const docRef = await firestoreInstance
            .collection('tickets')
            .add({
                title: title.trim(),
                description: description.trim(),
                type,
                status: 'open',
                clientId: currentUser.uid,
                clientName: clientName,
                clientEmail: currentUser.email,
                createdAt: firestore.FieldValue.serverTimestamp()
            });

        return docRef.id;
    } catch (error) {
        throw new Error(error.message || 'Failed to create ticket');
    }
};

/**
 * Subscribes to real-time updates of tickets created by current user
 * @param {function} callback - Function to call when tickets update
 * @param {function} onError - Optional error handler
 * @returns {function} Unsubscribe function to stop listening
 * @throws {Error} If user is not authenticated
 */
export const getMyTickets = (callback, onError) => {
    const currentUser = authInstance.currentUser;
    
    if (!currentUser) {
        const error = new Error('You must be logged in to view tickets');
        if (onError) {
        onError(error);
        }
        throw error;
    }

    const ticketsRef = collection(firestoreInstance, 'tickets');
    const q = query(
        ticketsRef,
        where('clientId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
    );

    return onSnapshot(
        q,
        (snapshot) => {
        const tickets = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(tickets);
        },
        (error) => {
        if (onError) {
            onError(error);
        }
        console.error('Error fetching tickets:', error);
        }
    );
};

/**
 * Subscribes to real-time updates of ALL tickets (for admins)
 * @param {function} callback - Function to call when tickets update
 * @param {function} onError - Optional error handler
 * @returns {function} Unsubscribe function to stop listening
 */
export const getAllTickets = (callback, onError) => {
    const ticketsRef = collection(firestoreInstance, 'tickets');
    const q = query(ticketsRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
        q,
        (snapshot) => {
        const tickets = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(tickets);
        },
        (error) => {
        if (onError) {
            onError(error);
        }
        console.error('Error fetching tickets:', error);
        }
    );
};

/**
 * Updates the status of a specific ticket
 * @param {string} ticketId - The unique ID of the ticket to update
 * @param {string} status - New status ('open', 'in-progress', 'resolved', 'closed')
 * @returns {Promise<void>}
 * @throws {Error} If update fails or validation fails
 */
export const updateTicketStatus = async (ticketId, status) => {
    try {
        if (!ticketId) {
        throw new Error('Ticket ID is required');
        }

        const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
        if (!validStatuses.includes(status)) {
        throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
        }

        const ticketRef = doc(firestoreInstance, 'tickets', ticketId);
        await updateDoc(ticketRef, {
        status,
        updatedAt: serverTimestamp()
        });
    } catch (error) {
        throw new Error(error.message || 'Failed to update ticket status');
  }
};

/**
 * Gets a single ticket by ID
 * @param {string} ticketId - The unique ID of the ticket
 * @returns {Promise<object>} Ticket object
 * @throws {Error} If ticket doesn't exist or fetch fails
 */
export const getTicketById = async (ticketId) => {
    try {
        if (!ticketId) {
        throw new Error('Ticket ID is required');
        }

        const ticketRef = doc(firestoreInstance, 'tickets', ticketId);
        const ticketDoc = await getDoc(ticketRef);
        
        if (!ticketDoc.exists()) {
        throw new Error('Ticket not found');
        }

        return { id: ticketDoc.id, ...ticketDoc.data() };
    } catch (error) {
        throw new Error(error.message || 'Failed to get ticket');
    }
};

/**
 * Export the auth state change listener for use in AppNavigator
 */
export { onAuthStateChanged, authInstance };