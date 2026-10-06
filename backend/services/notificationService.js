const Notification = require("../models/Notification");

const createNotification = (data) => Notification.create(data);

const createNotifications = (recipients, data) => {
  const recipientIds = [
    ...new Set(
      recipients
        .filter(Boolean)
        .map((recipient) => String(recipient._id || recipient))
    ),
  ];

  return Promise.all(
    recipientIds.map((recipient) =>
      createNotification({ ...data, recipient })
    )
  );
};

module.exports = { createNotification, createNotifications };
