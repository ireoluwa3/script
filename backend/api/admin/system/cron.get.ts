// /server/api/cron/index.get.ts

import CronJobManager from "@b/utils/cron";

export const metadata: OperationObject = {
  summary: "Run the cron job",
  operationId: "runCron",
  tags: ["Admin", "Cron"],
  description: "Runs the cron job to process pending tasks.",
  responses: {
    200: {
      description: "Cron job run successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Success message",
              },
            },
          },
        },
      },
    },
    400: {
      description: "Error running cron job",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Error message",
              },
            },
          },
        },
      },
    },
  },
  permission: "Access Admin Dashboard",
};

export default async () => {
  const cronJobManager = CronJobManager.getInstance();
  const cronJobs = cronJobManager.getCronJobs();
  return cronJobs.map((job) => {
    return {
      name: job.name,
      title: job.title,
      period: job.period,
      description: job.description,
      lastRun: job.lastRun,
    };
  });
};
