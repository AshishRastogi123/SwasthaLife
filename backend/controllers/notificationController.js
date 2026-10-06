const Notification = require("../models/Notification");

const listNotifications = async (req, res) => {
  const data = await Notification.find({ recipient: req.user.userId })
    .sort({ createdAt: -1 });
  res.json({ data });
};

const getUnreadNotificationCount = async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.user.userId,
    read: false,
  });
  res.json({ data: { count } });
};

const markNotificationRead = async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user.userId },
    { $set: { read: true } },
    { new: true }
  );
  if (!notification) return res.status(404).json({ message: "Notification not found" });
  res.json({ data: notification });
};

const markAllNotificationsRead = async (req, res) => {
  await Notification.updateMany({ recipient: req.user.userId, read: false }, { $set: { read: true } });
  res.status(204).send();
};

module.exports = {
  listNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
};
