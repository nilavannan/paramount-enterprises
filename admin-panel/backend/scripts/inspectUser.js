import mongoose from 'mongoose';
import { mongoDBURL } from '../config.js';
import { User } from '../models/userModel.js';

async function run() {
  try {
    await mongoose.connect(mongoDBURL);
    const user = await User.findOne({ username: 'testuser' }).lean();
    console.log(user);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

run();
