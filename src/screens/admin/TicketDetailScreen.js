
// TICKET DETAIL SCREEN - View full ticket details and update status
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert
} from 'react-native';
import { updateTicketStatus } from '../../config/firebase';

/**
 * Ticket detail screen component
 * @param {object} navigation - React Navigation object
 * @param {object} route - Route object containing ticket data passed from previous screen
 * @returns {JSX.Element} Ticket detail and status update UI
 * @description This screen allows admins to:
 *   1. View full ticket details
 *   2. Update ticket status (open, in-progress, resolved, closed)
 *   3. Client sees update in real-time
 *   4. Navigate back to ticket lists
 */
export default function TicketDetailScreen({ navigation, route }) {
    const { ticket } = route.params; // Get ticket data passed from AdminHomeScreen
    const statuses = ['open', 'in-progress', 'resolved', 'closed']; // Available status options

    /**
     * Updates ticket status in Firestore
     * @param {string} newStatus - New status value
     * @description When admin selects a status:
     *   1. Updates ticket status in Firestore
     *   2. Shows success message
     *   3. Navigates back to ticket list
     *   4. Client sees update in real-time
     */
    const handleStatusUpdate = async (newStatus) => {
        try {
            await updateTicketStatus(ticket.id, newStatus);
            Alert.alert('Success', 'Ticket status updated!');
            navigation.goBack(); // Return to ticket list
        } 
        catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    return (
        <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ticket Details</Text>
            <View style={{ width: 50 }} />
        </View>

        <ScrollView style={styles.content}>
            {/* TICKET TYPE BADGE */}
            <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>
                    {ticket.type === 'bug' ? '🐛 BUG' : '✨ FEATURE'}
                </Text>
            </View>

            {/* CLIENT INFO */}
            <View style={styles.clientInfo}>
                <Text style={styles.clientLabel}>Submitted by:</Text>
                <Text style={styles.clientName}>{ticket.clientName || 'Unknown User'}</Text>
                {ticket.clientEmail && (
                    <Text style={styles.clientEmail}>{ticket.clientEmail}</Text>
                )}
            </View>

            {/* TICKET TITLE */}
            <Text style={styles.title}>{ticket.title}</Text>

            {/* TICKET DESCRIPTION */}
            <Text style={styles.description}>{ticket.description}</Text>

            {/* CURRENT STATUS */}
            <View style={styles.currentStatusContainer}>
                <Text style={styles.currentStatusLabel}>Current Status:</Text>
                <Text style={styles.currentStatus}>{ticket.status}</Text>
            </View>

            {/* DIVIDER */}
            <View style={styles.divider} />

            {/* STATUS UPDATE SECTION */}
            <Text style={styles.sectionTitle}>Update Status</Text>

            {/* STATUS BUTTONS */}
            <View style={styles.statusButtons}>
            {statuses.map((status) => (
                <TouchableOpacity
                key={status}
                style={[
                    styles.statusButton,
                    ticket.status === status && styles.statusButtonCurrent
                ]}
                onPress={() => handleStatusUpdate(status)}
                >
                <Text
                    style={[
                    styles.statusButtonText,
                    ticket.status === status && styles.statusButtonTextCurrent
                    ]}
                >
                    {status.replace('-', ' ')}
                </Text>
                </TouchableOpacity>
            ))}
            </View>
        </ScrollView>
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
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    backButton: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: '600'
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937'
    },
    content: {
        flex: 1,
        padding: 20
    },
    typeBadge: {
        backgroundColor: '#e3f2ff',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginBottom: 16
    },
    typeBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#007AFF'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 16
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        marginBottom: 24
    },
    currentStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24
    },
    currentStatusLabel: {
        fontSize: 14,
        color: '#666',
        marginRight: 8
    },
    currentStatus: {
        fontSize: 14,
        fontWeight: '600',
        color: '#007AFF',
        textTransform: 'capitalize',
        backgroundColor: '#e3f2ff',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginBottom: 24
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 16
    },
    statusButtons: {
        gap: 12
    },
    statusButton: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#d1d5db',
        alignItems: 'center'
    },
    statusButtonCurrent: {
        borderColor: '#34d399',
        backgroundColor: '#d1fae5'
    },
    statusButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6b7280',
        textTransform: 'capitalize'
    },
    statusButtonTextCurrent: {
        color: '#059669'
    },
        clientInfo: {
        backgroundColor: '#f9fafb',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderLeftWidth: 3,
        borderLeftColor: '#6366f1'
    },
    clientLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4
    },
    clientName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 2
    },
    clientEmail: {
        fontSize: 13,
        color: '#6b7280'
    },
});