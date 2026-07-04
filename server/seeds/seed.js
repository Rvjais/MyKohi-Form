import mongoose from "mongoose";
import dotenv from "dotenv";
import FormTemplate from "../models/FormTemplate.js";
import myKohiOnboardingTemplate from "./defaultTemplate.js";
import patientIntakeTemplate from "./patientIntakeTemplate.js";
import feedbackTemplate from "./feedbackTemplate.js";
import referralTemplate from "./referralTemplate.js";

dotenv.config({ path: "../.env" });
dotenv.config({ path: "./.env" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mykohi_onboarding";

const templatesToSeed = [
  myKohiOnboardingTemplate,
  patientIntakeTemplate,
  feedbackTemplate,
  referralTemplate
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    for (const template of templatesToSeed) {
      const existing = await FormTemplate.findOne({ slug: template.slug });
      if (existing) {
        await FormTemplate.findByIdAndUpdate(existing._id, template, { runValidators: true });
        console.log(`Template '${template.name}' updated`);
      } else {
        await FormTemplate.create(template);
        console.log(`Template '${template.name}' created`);
      }
    }

    await mongoose.disconnect();
    console.log("Seed complete");
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
