import mongoose from "mongoose";
const TutorApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  letter: {
    type: String,
    required: true,
  },

 cvUrl: {
  type: String,
  required: true,
},
cvPublicId: {
  type: String,
  default: "",
},

  experiences: [
    {
      company: {
        type: String,
        required: true,
      },
      position: {
        type: String,
        required: true,
      },
      description: String,

      startDate: {
        type: Date,
        required: true,
      },

      endDate: Date,

      isCurrent: {
        type: Boolean,
        default: false,
      },
    }
  ],

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  }
,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  approvedAt: {
    type: Date,
  }
}, { timestamps: true });

const TutorApplication = mongoose.model("TutorApplication", TutorApplicationSchema);
export default TutorApplication;