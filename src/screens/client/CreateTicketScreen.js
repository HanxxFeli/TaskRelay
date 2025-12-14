// CREATE TICKET SCREEN - Form to submit new bug reports or feature requests

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Alert
} from 'react-native';
import { createTicket } from '../../config/firebase';

/**
 * Create ticket screen component
 * @returns {JSX.Element} Ticket creation form UI
 * @description This screen allows clients to:
 *   1. Choose ticket type (bug or feature)
 *   2. Enter title and description
 *   3. Submit ticket to Firestore
 *   4. Form clears after successful submission
 */
export default function CreateTicketScreen() {
    // State for ticket form inputs
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('bug'); // Default to 'bug' type
    const [loading, setLoading] = useState(false);

    /**
     * Handles ticket submission
     * @description When user clicks "Submit Ticket":
     *   1. Validates that all fields are filled
     *   2. Creates ticket in Firestore
     *   3. Clears the form
     *   4. Shows success message
     *   5. Ticket automatically appears in Home tab (real-time listener)
     */
    const handleSubmit = async () => {
        // Validation: Check if fields are filled
        if (!title.trim() || !description.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        
        setLoading(true);
    
        try {
            // Create the ticket in Firestore
            await createTicket(title.trim(), description.trim(), type);
            
            // Clear form after successful submission
            setTitle('');
            setDescription('');
            setType('bug'); // Reset to default
            
            // Show success message
            Alert.alert('Success', 'Ticket created successfully!');
            } 
        catch (error) {
            
            Alert.alert('Error', error.message); // Show error if something goes wrong
        } 
        finally {
            setLoading(false);
        }
    };

  return (
    <ScrollView style={styles.container}>
        <View style={styles.content}>
            {/* Screen Title */}
            <Text style={styles.title}>Create New Ticket</Text>
            <Text style={styles.subtitle}>
                Report a bug or request a new feature
            </Text>

            {/* TYPE SELECTOR */}
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeContainer}>
                {/* Bug Type Button */}
                <TouchableOpacity
                style={[
                    styles.typeButton,
                    type === 'bug' && styles.typeButtonActive
                ]}
                onPress={() => setType('bug')}
                >
                <Text style={styles.typeEmoji}>🐛</Text>
                <Text
                    style={[
                    styles.typeButtonText,
                    type === 'bug' && styles.typeButtonTextActive
                    ]}
                >
                    Bug
                </Text>
                <Text style={styles.typeDescription}>
                    Something isn't working
                </Text>
                </TouchableOpacity>

                {/* Feature Type Button */}
                <TouchableOpacity
                style={[
                    styles.typeButton,
                    type === 'feature' && styles.typeButtonActive
                ]}
                onPress={() => setType('feature')}
                >
                <Text style={styles.typeEmoji}>✨</Text>
                <Text
                    style={[
                    styles.typeButtonText,
                    type === 'feature' && styles.typeButtonTextActive
                    ]}
                >
                    Feature
                </Text>
                <Text style={styles.typeDescription}>
                    Request new functionality
                </Text>
                </TouchableOpacity>
            </View>

            {/* TITLE INPUT */}
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                placeholder="Brief description of the issue"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
            />

            {/* DESCRIPTION INPUT */}
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Provide detailed information..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
            />

            {/* SUBMIT BUTTON */}
            <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={styles.submitButtonText}>
                {loading ? 'Creating...' : 'Submit Ticket'}
                </Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
  );
}

// Styles for this screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    content: {
        padding: 20,
        paddingTop: 50
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        marginTop: 16
    },
    typeContainer: {
        flexDirection: 'row',
        gap: 12
    },
    typeButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#d1d5db',
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    typeButtonActive: {
        borderColor: '#007AFF',
        backgroundColor: '#e3f2ff'
    },
    typeEmoji: {
        fontSize: 32,
        marginBottom: 8
    },
    typeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 4
    },
    typeButtonTextActive: {
        color: '#007AFF'
    },
    typeDescription: {
        fontSize: 12,
        color: '#9ca3af',
        textAlign: 'center'
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1f2937'
    },
    textArea: {
        height: 120,
        paddingTop: 12
    },
    submitButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 40
    },
    submitButtonDisabled: {
        backgroundColor: '#9ca3af'
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600'
    }
});