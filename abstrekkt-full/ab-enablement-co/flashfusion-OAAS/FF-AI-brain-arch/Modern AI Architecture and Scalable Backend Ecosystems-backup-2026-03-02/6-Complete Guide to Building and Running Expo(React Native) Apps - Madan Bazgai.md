> Source: https://madanbajgai.com.np/blog/complete-guide-to-building-and-running-expo-react-native-apps/

Home » BlogsComplete Guide to Building and Running Expo(React Native) Apps
Desc Text. Table of Contents
Summary
1. Expo Go
2. Expo Prebuild
3. Native BuildsAndroid (via Android Studio)
iOS (via Xcode)
4. EAS Builds
5. Debugging Options
Best Practices
Summary#
This guide covers five main methods to build and run Expo applications:
Expo Go - Fastest method for development and testing, limited to built-in native modules
Expo Prebuild - Generates native code when additional native modules are needed
Native Builds - Direct builds through Android Studio or Xcode
EAS (Expo Application Service) - Cloud-based build service for production releases
Debugging Tools - Various options for debugging your Expo app
1. Expo Go#
The simplest way to test your app during development.
Basic Commands:
npx expo start  # or just: npx expo  
Run Options:
Scan QR code with Expo Go app on device
Press  a  - Run on Android (simulator or connected device)
Press  i  - Run on iOS simulator
Press  w  - Run in web browser
2. Expo Prebuild#
Use when you need additional native modules not included in Expo Go.
Generate Native Code:
# Generate for both platforms  npx expo prebuild  # Platform specific  npx expo prebuild --platform android npx expo prebuild --platform ios  # Reset native code after config changes  npx expo prebuild --clean 
Run Development Build:
# Build and run  npx expo run:android npx expo run:ios  # Run on connected device  npx expo run:android --device npx expo run:ios --device 
3. Native Builds#
Android (via Android Studio)#
# Development build  npx expo run:android  # Release build  npx expo run:android --variant release --device cd android  &&  ./gradlew assembleRelease 
iOS (via Xcode)#
# Development build  npx expo run:ios  # Release build  npx expo run:ios --configuration Release --device 
Note: Keep Metro server running in background for development builds.
4. EAS Builds#
Setup:
# Install and configure  npm install --global eas-cli eas login eas build:configure 
Build Commands:
# Production builds  eas build --platform all eas build --platform android eas build --platform ios  # Development/Preview builds  eas build -p android --profile preview eas build -p ios --profile preview  # Local builds  eas build -p android --profile development --local eas build -p ios --profile development --local 
5. Debugging Options#
Press  j  - Open Chrome DevTools
Press  cmd + ctrl + z  - Open React Native debugger UI
Install enhanced debugger: npx expo install expo-dev-client 
Then use  cmd + ctrl + z
Best Practices#
Start with Expo Go for rapid development
Use Prebuild when you need custom native modules
Use EAS for production builds
Use Native Builds when you need platform-specific customizations
Always test on both platforms before releasing