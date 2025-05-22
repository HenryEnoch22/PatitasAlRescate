import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/patitasdb";

const userSchema = new mongoose.Schema({ email: String });
const reportSchema = new mongoose.Schema({ userEmail: String, userId: mongoose.Schema.Types.ObjectId });

const User = mongoose.model("User", userSchema);
const Report = mongoose.model("Report", reportSchema);

const migrate = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Conectado a MongoDB");

    const reports = await Report.find({ userEmail: { $exists: true } });

    for (const report of reports) {
      const user = await User.findOne({ email: report.userEmail });
      if (user) {
        report.userId = user._id;
        await report.save();
        console.log(`Migrado: ${report.userEmail} -> ${user._id}`);
      } else {
        console.warn(`Usuario no encontrado para ${report.userEmail}`);
      }
    }

    await Report.updateMany({}, { $unset: { userEmail: "" } });

    console.log("Migración finalizada");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

migrate();
