// ADMIN HOME SCREEN - View all tickets from all clients

import { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    Alert
} from 'react-native';
import { getAllTickets, signOut } from '../../config/firebase';

/**
 * Renders a single ticket card
 * @param {object} item - Ticket object from Firestore
 * @param {function} onPress - Function to call when card is pressed
 * @returns {JSX.Element} Ticket card UI
 * @description Displays ticket information:
 *   - Type (bug/feature)
 *   - Title
 *   - Description preview (truncated)
 *   - Current status
 *   - Clickable to open full details
 */
const TicketCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.ticket} onPress={() => onPress(item)}>
        <View style={styles.ticketHeader}>
            <Text style={styles.ticketType}>
                {item.type === 'bug' ? '🐛' : '✨'} {item.type.toUpperCase()}
            </Text>
            {/* Add client name badge */}
            <Text style={styles.clientBadge}>
                👤 {item.clientName || 'Unknown'}
            </Text>
        </View>
        <Text style={styles.ticketTitle}>{item.title}</Text>
        <Text style={styles.ticketDesc} numberOfLines={2}>
            {item.description}
        </Text>
        <View style={styles.statusContainer}>
            <Text style={styles.ticketStatus}>Status: {item.status}</Text>
        </View>
    </TouchableOpacity>
  );
};

/**
 * Admin home screen component
 * @param {object} navigation - React Navigation object for screen navigation
 * @returns {JSX.Element} Admin interface with all tickets
 * @description This screen allows admins to:
 *   1. View ALL tickets from all clients
 *   2. Click on tickets to see full details and update status
 *   3. See real-time updates when clients create tickets
 *   4. Pull to refresh
 *   5. Log out
 */
export default function AdminHomeScreen({ navigation }) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading indicator  
    const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
    const [error, setError] = useState(null) // error state

    /**
     * useEffect: Subscribe to real-time ticket updates
     * @description When component mounts:
     *   1. Sets up real-time listener for ALL tickets
     *   2. Updates ticket list whenever any ticket changes in Firestore
     *   3. Cleans up listener when component unmounts
     */
    useEffect(() => {
        let unsubscribe;

        try { 
            // Subscribe to real-time updates with error handling
            unsubscribe = getAllTickets(
                (data) => {
                    setTickets(data);
                    setLoading(false);
                    setRefreshing(false);
                    setError(null); // clear errors
                },
                (err) => { 
                    console.error('Error fetching tickets:', err);
                    setError(err.message);
                    setLoading(false);
                    setRefreshing(false);
                }
            );
        } 
        catch (err) { 
            console.error('Error setting up listener:', err);
            setError(err.message); 
            setLoading(false);
        }

        return () => {
            if (unsubscribe) {
                // null checking
                unsubscribe();
            }
        };
    }, []);

    /**
     * Handles pull-to-refresh
     * @description Triggers refresh animation
     *   Real-time listener automatically updates data
     */
    const onRefresh = () => {
        setRefreshing(true); // Data will update automatically via real-time listener
    };

    /**
     * Opens ticket detail screen
     * @param {object} ticket - The ticket object to display
     * @description When admin clicks a ticket:
     *   1. Navigates to TicketDetailScreen
     *   2. Passes ticket data to that screen
     */
    const handleTicketPress = (ticket) => {
        navigation.navigate('TicketDetail', { ticket });
    };

    /**
     * Renders empty state when no tickets exist
     * @returns {JSX.Element} Empty state UI
     */
    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📭</Text>
        <Text style={styles.emptyTitle}>No tickets yet</Text>
        <Text style={styles.emptyText}>
            Waiting for clients to submit tickets...
        </Text>
        </View>
    );

    // add error message using existing emojis and styles
    const renderError = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>⚠️</Text>
            <Text style={styles.emptyTitle}>Error Loading Tickets</Text>
            <Text style={styles.emptyText}>{error}</Text>
            <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                    setLoading(true);
                    setError(null);
                }}
            >
                <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
        </View>
    );

    // signout handling
    const handleLogout = async () => { 
        try {
            await signOut();
        } 
        catch (err) {
            Alert.alert('Error', 'Failed to logout. Please try again.');
        }
    };

  return (
    <View style={styles.container}>
        {/* HEADER SECTION */}
        <View style={styles.header}>
            <View>
                <Text style={styles.headerTitle}>All Tickets</Text>
                <Text style={styles.headerSubtitle}>{tickets.length} total</Text>
            </View>
            {/* Logout Button */}
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Text style={styles.logout}>Logout</Text>
            </TouchableOpacity>
        </View>

        {/* TICKETS LIST */}
        <FlatList
            data={tickets}
            renderItem={({ item }) => (
                <TicketCard item={item} onPress={handleTicketPress} />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={!loading && (error ? renderError() : renderEmpty())}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        />
    </View>
  );
}

// Styles for this screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937'
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4
    },
    logoutButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        backgroundColor: '#fee2e2'
    },
    logout: {
        color: '#dc2626',
        fontWeight: '600',
        fontSize: 14
    },
    listContent: {
        padding: 16
    },
    ticket: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2
    },
    ticketType: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8
    },
    ticketTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 8
    },
    ticketDesc: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 12
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    ticketStatus: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '600',
        textTransform: 'capitalize'
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64
    },
    emptyEmoji: {
        fontSize: 64,
        marginBottom: 16
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 8
    },
    emptyText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center'
    },
    retryButton: {
        marginTop: 16,
        backgroundColor: '#007AFF',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14
    },
    ticketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    clientBadge: {
        fontSize: 11,
        fontWeight: '600',
        color: '#6366f1',
        backgroundColor: '#eef2ff',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
});