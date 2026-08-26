> Source: https://levi9-serbia.medium.com/react-native-app-deployment-with-expo-eas-cli-your-complete-guide-to-app-store-publishing-d4674cb00518

SitemapOpen in app
Sign in
Medium LogoWriteSearch
Sign in
React Native App Deployment with Expo & EAS CLI: Your Complete Guide to App Store Publishing
Levi9 Serbia5 min read · Nov 12, 2025--
Deploying a React Native app to app stores can be time-consuming and error-prone. Fortunately, Expo Application Services (EAS) offers a powerful toolset that simplifies the entire process — from configuration to submission on both the App Store and Google Play.
This comprehensive guide from Mobile Developers at Levi9 Serbia walks you through every step from setup to successful app store publication.
What You’ll Learn
In this guide, you’ll learn how to:
Configure and build a React Native app using Expo CLI
Deploy to both iOS App Store and Google Play Store using Expo Application Services — EAS
Navigate the entire pipeline from initial setup to successful publication.
Press enter or click to view image in full size
Prerequisites
Before you begin, make sure you have:
· Basic React Native app created with Expo
· Node.js (version 16 or higher) installed
· Active Apple Developer account ($99/year) for iOS deployment
· XCode and Android Studio installed
· Active Google Play Console account ($25 one-time fee) for Android deployment
· Active Expo EAS account (free plan available)
Step 1: Set Up Your Development Environment using Expo Dev Client
Install Prerequisites
First, create your React Native app via Expo:
npx create-expo-app@latest
Then, ensure you have the latest Expo CLI, EAS CLI and Expo Dev Client installed:
npm install -g @expo/cli@latest 
 npm install -g eas-cli@latest
Next, install Expo Dev Client:
npx expo install expo-dev-client
For detailed setup instructions for Android Studio and Xcode, refer to the official Expo documentation.
Build the app
The Expo prebuild command regenerates your iOS and Android projects. Use this command initially and whenever project configuration, generally, or iOS and Android specifically, is changed in app.json or app.config.ts.
npx expo prebuild(android | ios)
Now you are ready to build the app for iOS simulator or Android emulator or physical devices with adding device flag to basic command:
npx expo run:ios (--device) 
 npx expo run:android (--device)
Once the app is built, start development server to see code changes in real-time:
npx expo start
Restrictive network conditions, common for public Wi-Fi or firewalls, can make it difficult to connect to dev server and run the app. Solution is to add tunnel flag:
npx expo start –tunnel
To enable tunneling you will need to install ngrok:
npm i -g @expo/ngrok
Note: If the app doesn’t start immediately after building, run the development server with the tunnel flag after the build completes.
Step 2: Deploy Your App with Expo Application Services (EAS)
Configure Your project
The EAS Dashboard allows you to manage projects, team members, create access tokens, add environment variables and secrets for all your projects — all in one centralized location .
Once you create your project in EAS Dashboard, you can:
- Add project-specific environment variables,
- Track and monitor uploaded builds,
- Publish builds submitted to App Stores,
- Send push notifications and many more.
In the Credentials section, configure your iOS bundle identifier and Android package name.
For iOS apps, upload:
· Valid provisioning profile
· Valid distribution certificate
· Valid p8 key for push notifications
· Valid App Store Connect API Key for Test Flight to App Store Connect submissions
For Android apps, upload:
· Valid Android upload keystore
· Valid FCM V1 service account for push notifications
· Valid Google service account key, for automatic submissions to Google Play Console via EAS Submit — available in your GCP project
Alternatively, you can also navigate through the project configuration with EAS CLI through terminal:
eas build:configure
Build and Upload Your App
Make sure you are authenticated with EAS so you can use eas cli without any problems:
eas login
Trigger your first build:
eas build --profile (development | preview | production) --platform (ios | android)
After the build completes, download the binary and upload it to TestFlight (iOS) or Google Play’s testing track (Android).
To manipulate profiles configurations, development, preview or production you must create eas.json file. Here is an example for preview and production profiles:
Press enter or click to view image in full size
You can see more about the eas.json properties at: https://docs.expo.dev/eas/json/
You can also add a submit configuration to automate app store submissions:
Press enter or click to view image in full size
To execute submit step, we can run this command, once our production build is complete:
eas submit --platform (android | ios) 
For automatic submission immediately after building:
eas build --platform (android | ios) --auto-submit 
Tip: Use .easignore which is essentialy a copy of .gitignore but allows us to keep imporant stuff in .gitgnore and exlude them in .easignore if they are crucial to eas build.
Important: Development profile builds require the Metro bundler running and are designed for use with simulators/emulators.
You can find more information at: https://docs.expo.dev/build/eas-json/
CI/CD Integration
EAS integrates seamlessly with popular CI/CD platforms including GitHub Actions, GitLab CI, and Bitrise. You can automate your entire build and deployment pipeline using EAS CLI in your existing workflows.
Conclusion
Expo and EAS have transformed React Native app deployment from a complex, error-prone process into a streamlined workflow. Whether you’re a independent developer or part of a team, these tools scale with your workflow and simplify store distribution.
The investment in learning and using Expo can be a huge pay off due to its flexibility, scalability and very reasonable pricing plans when it comes to deployment.
Partner with Levi9 for Expert React Native Development
Need expert support to accelerate your React Native app development and deployment?
Levi9 Global Sourcing specializes in React Native and Expo development. Our experienced team can help you:
• Design and architect production-ready mobile apps
• Implement best practices for Expo and EAS workflows
• Optimize your CI/CD pipeline for faster releases
• Navigate app store submission requirements
Learn more about Expo Application Services or contact us to accelerate your app launch.
Written by Aleksandar Ivanović, Mobile Developer
React NativeLevi9serbiaMobile DevelopmentMobile Apps
Written by  Levi9 Serbia
124 followers·50 followingWe make an impact with technology.
No responses yet
Help
Status
About
Careers
Press
Blog
Privacy
Rules
Terms
Text to speech