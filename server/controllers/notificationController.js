import Notification from "../models/notification.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
};

export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark all as read" });
  }
};
