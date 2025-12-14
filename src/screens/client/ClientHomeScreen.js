// CLIENT HOME SCREEN - View all your submitted tickets

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
import { getMyTickets, signOut } from '../../config/firebase';

/**
 * Renders a single ticket card
 * @param {object} item - Ticket object from Firestore
 * @returns {JSX.Element} Ticket card UI
 * @description Displays ticket information:
 *   - Type (bug/feature)
 *   - Title
 *   - Description
 *   - Current status
 */
const TicketCard = ({ item }) => {
    return (
        <View style={styles.ticket}>
        <Text style={styles.ticketType}>
            {item.type === 'bug' ? '🐛' : '✨'} {item.type.toUpperCase()}
        </Text>
        <Text style={styles.ticketTitle}>{item.title}</Text>
        <Text style={styles.ticketDesc} numberOfLines={3}>
            {item.description}
        </Text>
        <View style={styles.statusContainer}>
            <Text style={styles.ticketStatus}>Status: {item.status}</Text>
        </View>
        </View>
    );
};

/**
 * Client home screen component
 * @returns {JSX.Element} Client interface showing all their tickets
 * @description This screen allows clients to:
 *   1. View all their submitted tickets
 *   2. See real-time status updates
 *   3. Pull to refresh
 *   4. Log out
 */
export default function ClientHomeScreen() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let unsubscribe;

        try {
            // Subscribe to real-time updates with error handling
            unsubscribe = getMyTickets(
                (data) => {
                setTickets(data);
                setLoading(false);
                setRefreshing(false);
                setError(null);
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

        // Unsubscribe when component unmounts
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

    // Handles pull-to-refresh
    const onRefresh = () => {
        setRefreshing(true);
    };

    // logout handling
    const handleLogout = async () => {
        try {
        await signOut();
        } catch (err) {
        Alert.alert('Error', 'Failed to logout. Please try again.');
        }
    };

    // empty state handling and rendering
    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyTitle}>No tickets yet</Text>
            <Text style={styles.emptyText}>
                Tap the "New Ticket" tab to create your first ticket!
            </Text>
        </View>
    );

    // error state handling and rendering
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

    return (
        <View style={styles.container}>
        {/* HEADER SECTION */}
        <View style={styles.header}>
            <View>
                <Text style={styles.headerTitle}>My Tickets</Text>
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
            renderItem={({ item }) => <TicketCard item={item} />}
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

// Styles
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
        textAlign: 'center',
        paddingHorizontal: 40
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
    }
});