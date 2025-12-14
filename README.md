# TaskRelay 

A React Native mobile application for seamless ticket management between clients and administrators. Clients can submit bug reports and feature requests, while admins can view, manage, and update ticket statuses in real-time using Firebase.

## 📖 Project Description

TaskRelay is a ticket management system that enables efficient communication between clients and support teams. The app features role-based access control with two distinct user experiences:

**Client Interface:**
- Submit bug reports and feature requests
- View personal ticket history
- Track ticket status in real-time
- Simple, intuitive ticket creation form

**Admin Interface:**
- View all tickets from all clients
- Update ticket statuses (open, in-progress, resolved, closed)
- See client information for each ticket
- Real-time updates across all devices

The application uses Firebase Authentication for secure user management and Cloud Firestore for real-time data synchronization, ensuring instant updates when ticket statuses change.

## 🛠️ Tech Stack

- **Frontend**: React Native
- **Navigation**: React Navigation
- **Backend**: Firebase (Authentication + Firestore)
- **Language**: JavaScript

## 🔑 Test Credentials

### Client Account
```
Email: joshseki@gmail.com
Password: password
```
**Access**: Can create tickets and view own submissions

### Admin Account
```
Email: admin@gmail.com
Password: password
```
**Access**: Can view all tickets and update their statuses

## 🚀 Key Features

- Real-time synchronization across all devices
- Role-based access control (client vs admin)
- Clean, modern mobile UI
- Pull-to-refresh functionality
- Ticket categorization (Bug/Feature)
- Status tracking (Open → In Progress → Resolved → Closed)

## 📱 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/taskrelay.git
cd taskrelay

# Install dependencies
npm install

# Run on Android
npx react-native run-android

# Run on iOS (Mac only)
npx react-native run-ios
```

**Note**: Requires Firebase project setup with Authentication and Firestore enabled. Configuration files (`google-services.json` for Android and `GoogleService-Info.plist` for iOS) must be added to run the app.

---

## Firebase Setup Required
   
   The following files are required but not included in the repository (for security):
   - `android/app/google-services.json`
   - `ios/GoogleService-Info.plist`
   
   Contact the project owner or set up your own Firebase project to obtain these files.

**Built with React Native + Firebase** | [View Demo](#) | [Report Bug](#)