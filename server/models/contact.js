import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: [
        "phone",
        "email",
        "whatsapp",
        "telegram",
        "facebook",
        "instagram",
        "twitter",
        "linkedin",
        "youtube",
        "tiktok",
        "website",
        "other",
      ],
      required: true,
    },
    label: { type: String, trim: true },
    value: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
