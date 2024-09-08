import { models } from "@b/db";
import { handleClientMessage } from "@b/handler/Websocket";
import { taskQueue } from "./task";
import { logError } from "@b/utils/logger";

/**
 * Saves a notification to the database.
 *
 * @param {string} userId - The ID of the user to whom the notification is sent.
 * @param {string} title - The title of the notification.
 * @param {string} message - The message of the notification.
 * @param {string} type - The type of the notification.
 * @param {string} [link] - Optional link associated with the notification.
 * @returns {Promise<Notification>} The saved notification.
 */
export async function saveNotification(
  userId: string,
  title: string,
  message: string,
  type: NotificationType,
  link?: string
): Promise<Notification> {
  try {
    return (await models.notification.create({
      userId,
      type,
      title,
      message,
      link,
    })) as unknown as Notification;
  } catch (error) {
    logError("notification", error, __filename);
    throw error;
  }
}

/**
 * Finds users with a role that has the specified permission and sends them a notification.
 *
 * @param permissionName - The name of the permission to check for.
 * @param title - The title of the notification.
 * @param message - The message of the notification.
 * @param type - The type of the notification.
 * @param link - Optional link associated with the notification.
 */
export async function notifyUsersWithPermission(
  permissionName: string,
  title: string,
  message: string,
  type: NotificationType,
  link?: string
): Promise<void> {
  try {
    const users = await models.user.findAll({
      include: [
        {
          model: models.role,
          as: "role",
          include: [
            {
              model: models.rolePermission,
              as: "rolePermissions",
              where: {
                "$role.rolePermissions.permission.name$": permissionName,
              },
              include: [
                {
                  model: models.permission,
                  as: "permission",
                  required: true,
                },
              ],
            },
          ],
          required: true,
        },
      ],
      attributes: ["id"],
    });

    // Loop through the users and send them notifications
    const notificationPromises = users.map((user) =>
      saveNotification(user.id, title, message, type, link)
    );

    // Wait for all notifications to be sent
    await Promise.all(notificationPromises);
  } catch (error) {
    logError("notification", error, __filename);
    throw error;
  }
}

/**
 * Create a new notification and send it to the user.
 *
 * @param {string} userId - The ID of the user to send the notification to.
 * @param {string} type - The type of notification (SECURITY, SYSTEM, ACTIVITY).
 * @param {string} title - The title of the notification.
 * @param {string} message - The message of the notification.
 * @param {string} [link] - Optional link associated with the notification.
 * @param {string} [icon] - Optional icon associated with the notification.
 */
export const handleNotification = async ({
  userId,
  type,
  title,
  message,
  link,
  icon,
}: {
  userId: string;
  type: "SECURITY" | "SYSTEM" | "ACTIVITY";
  title: string;
  message: string;
  link?: string;
  icon?: string;
}) => {
  try {
    const task = async () => {
      // Create the notification in the database
      const notification = await models.notification.create({
        userId,
        type,
        title,
        message,
        link,
        icon,
      });

      // Send the notification to the user
      await handleClientMessage({
        type: "notifications",
        method: "create",
        clientId: userId,
        data: notification.get({ plain: true }),
      });
    };

    await taskQueue.add(task);
  } catch (error) {
    logError("notification", error, __filename);
    throw error;
  }
};
