#!/bin/sh

# Function to generate APK
generate_apk() {
    npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/build/intermediates/res/merged/release/
    
    cd android || exit
    ./gradlew clean || exit
    ./gradlew assembleRelease || exit

    current_datetime=$(date +"%Y-%m-%d_%H-%M-%S")
    new_file_name="PROD_SA_1_${current_datetime}.apk"
    cp ./app/build/outputs/apk/release/app-release.apk "../${new_file_name}" || exit
    echo "APK file generated: ${new_file_name}"

    cd ..
}

# Function to generate AAB
generate_aab() {
    npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/build/intermediates/res/merged/release/
    
    cd android || exit
    ./gradlew clean || exit
    ./gradlew bundleRelease || exit

    current_datetime=$(date +"%Y-%m-%d_%H-%M-%S")
    new_file_name="PROD_HV_3.2_${current_datetime}.aab"
    cp ./app/build/outputs/bundle/release/app-release.aab "../${new_file_name}" || exit
    echo "AAB file generated: ${new_file_name}"

    cd ..
}

# Prompt user for choice
read -p "Do you want to generate an APK (a) or AAB (b)? [a/b]: " choice

# Check user's choice
if [ "$choice" = "a" ]; then
    generate_apk
elif [ "$choice" = "b" ]; then
    generate_aab
else
    echo "Invalid choice. Please enter 'a' for APK or 'b' for AAB."
fi
