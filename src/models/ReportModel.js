import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		petName: {
			type: String,
			required: true,
		},

		petDetails: {
			breed: {
				type: String,
				required: true,
			},
			species: {
				type: String,
				required: true,
			},
			color: {
				type: String,
				required: true,
			},
		},
		userContact: {
			type: String,
			required: true,
		},
		lastSeenLocation: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ["started", "fake", "finished"],
			default: "started",
		},
		fakeReports: [
			{
				reportedBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				reason: {
					type: String,
					required: true,
				},
			},
		],
		photo: {
			// Can use a string for URL or a Buffer for binary data
			type: Buffer,
			required: false,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Report", reportSchema);
