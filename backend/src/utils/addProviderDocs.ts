import initializeFirebase, { db } from '../config/firebase.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase before using it
initializeFirebase();

/**
 * Script to add Firestore documents for existing Firebase Auth users
 * 
 * INSTRUCTIONS:
 * 1. Go to Firebase Console → Authentication → Users
 * 2. Add users manually with email/password
 * 3. Copy the User UID for each user
 * 4. Update the 'uid' field below for each provider
 * 5. Run: npm run add-provider-docs
 */

const providers = [
  {
    uid: 'iFkpSLq2yRPWDFnC3i84vcJywt93',  // Replace with actual UID from Firebase Console
    email: 'dr.smith@healthportal.com',
    firstName: 'John',
    lastName: 'Smith',
  },
  {
    uid: 'WqcylsM3ZcayuUcopOZjl89ifgM2',  // Replace with actual UID from Firebase Console
    email: 'dr.johnson@healthportal.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
  },
];

const main = async () => {
  console.log('🏥 Adding Firestore documents for providers...\n');

  for (const provider of providers) {
    try {
      console.log(`Adding documents for: ${provider.email}`);

      // Create user document in Firestore
      await db().collection('users').doc(provider.uid).set({
        email: provider.email,
        role: 'provider',
        createdAt: new Date(),
        lastLogin: new Date(),
        isActive: true,
      });

      console.log(`✓ Created users document`);

      // Create profile document
      await db().collection('profiles').doc(provider.uid).set({
        userId: provider.uid,
        firstName: provider.firstName,
        lastName: provider.lastName,
      });

      console.log(`✓ Created profile document`);
      console.log(`✅ ${provider.email} - Done!\n`);
    } catch (error: any) {
      console.error(`❌ Error for ${provider.email}:`, error.message);
    }
  }

  console.log('✅ Script completed!');
  process.exit(0);
};

main();
