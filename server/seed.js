import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Activity from "./models/Activity.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || "mongodb+srv://jitendrabisht2062004_db_user:0tJWoaLzdH7AMFxC@cluster0.15bfvof.mongodb.net/teacher_insights?retryWrites=true&w=majority";
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully!");

    // Check if data already exists
    const count = await Activity.countDocuments();
    if (count > 0) {
      console.log(`\n⚠️  Warning: Collection already has ${count} documents.`);
      console.log("Do you want to clear existing data and reseed? (y/n)");
      console.log("Note: This script will skip seeding if data exists.");
      console.log("To reseed, manually delete the collection first.\n");
      return;
    }

    // Read seed data from JSON file
    const dataPath = path.join(__dirname, "seed-data.json");
    const jsonData = fs.readFileSync(dataPath, "utf8");
    const activitiesData = JSON.parse(jsonData);

    // Convert date strings to Date objects
    const activities = activitiesData.map((activity) => ({
      ...activity,
      Created_at: new Date(activity.Created_at),
    }));

    // Insert data
    console.log(`\nInserting ${activities.length} activities...`);
    await Activity.insertMany(activities);
    console.log(`✅ Successfully seeded ${activities.length} activities!`);

    // Verify insertion
    const finalCount = await Activity.countDocuments();
    console.log(`\n📊 Total documents in collection: ${finalCount}`);

    // Show summary by teacher
    const teachers = await Activity.distinct("Teacher_id");
    console.log(`\n👥 Teachers found: ${teachers.length}`);
    for (const teacherId of teachers) {
      const teacherActivities = await Activity.find({ Teacher_id: teacherId });
      const teacherName = teacherActivities[0]?.Teacher_name || "Unknown";
      console.log(`   - ${teacherName} (${teacherId}): ${teacherActivities.length} activities`);
    }

    console.log("\n✨ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("\n🔌 Disconnected from MongoDB");
  }
}

// Run the seed function
seedDatabase();
