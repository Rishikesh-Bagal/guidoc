import { db } from './config/firebase.js';
import { userService } from './services/userService.js';

async function test() {
  try {
    console.log("Testing saveFavorite...");
    await userService.saveFavorite('testUserId123', { id: 'pan-card', title: 'PAN Card', category: 'ID' });
    console.log("Finished test.");
  } catch (error) {
    console.error("Test Error:", error);
  }
}

test();
