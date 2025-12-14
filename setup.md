# TaskRelay Setup Guide 🚀

Follow these steps to set up TaskRelay on your local machine.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- React Native development environment
- Android Studio (for Android) or Xcode (for iOS on Mac)

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/taskrelay.git
cd taskrelay
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

You have two options:

#### Option A: Use the Provided .env File (Easiest)

If you received a `.env` file from the project owner:

1. Copy the `.env` file to the project root directory
2. That's it! Skip to step 4.

#### Option B: Create Your Own

1. Copy `.env.example` to `.env`:
```bash
   cp .env.example .env
```

2. Fill in the Firebase values (contact project owner for these)

### 4. Set Up Firebase Config Files

You still need the native Firebase config files:

**For Android:**
- Get `google-services.json` from project owner or Firebase Console
- Place it at: `android/app/google-services.json`

**For iOS:**
- Get `GoogleService-Info.plist` from project owner or Firebase Console  
- Place it at: `ios/GoogleService-Info.plist`

### 5. Install iOS Dependencies (Mac only)
```bash
cd ios
pod install
cd ..
```

### 6. Run the App

**Android:**
```bash
npx react-native run-android
```

**iOS (Mac only):**
```bash
npx react-native run-ios
```

## Test Credentials

### Client Account
```
Email: joshseki@gmail.com
Password: password
```

### Admin Account
```
Email: admin@gmail.com
Password: password
```

## Troubleshooting

### "Firebase not configured" error
- Ensure `.env` file is in the project root
- Check that `google-services.json` (Android) or `GoogleService-Info.plist` (iOS) are in place
- Try cleaning the build and reinstalling

### Metro bundler issues
```bash
npm start -- --reset-cache
```

### Android build fails
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### iOS build fails (Mac)
```bash
cd ios
pod deintegrate
pod install
cd ..
npx react-native run-ios
```

## Need Help?

Contact [Your Name] at [your.email@example.com]
```

## Step 8: Create a Package for Your Professor

Create a folder structure like this:
```
TaskRelay-Setup-Package/
├── .env                          # Your actual .env file
├── google-services.json          # Android config
├── GoogleService-Info.plist      # iOS config
├── SETUP-INSTRUCTIONS.txt        # Simple text instructions
└── README.txt                    # Brief overview