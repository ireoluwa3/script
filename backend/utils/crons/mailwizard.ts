import { models } from "@b/db";
import { logError } from "../logger";
import { sendEmailToTargetWithTemplate } from "../emails";

export async function processMailwizardCampaigns() {
  try {
    const campaigns = await models.mailwizardCampaign.findAll({
      where: { status: "ACTIVE" },
      include: [
        {
          model: models.mailwizardTemplate,
          as: "template",
        },
      ],
    });

    for (const campaign of campaigns) {
      let sentCount = 0;

      if (!campaign.targets) continue;

      let targets: {
        email: string;
        status: string;
      }[] = [];

      try {
        targets = JSON.parse(campaign.targets);
      } catch (error) {
        logError(`processMailwizardCampaigns`, error, __filename);
        continue;
      }

      for (const target of targets) {
        if (target.status === "PENDING" && sentCount < campaign.speed) {
          try {
            await sendEmailToTargetWithTemplate(
              target.email,
              campaign.subject,
              campaign.template.content
            );
            target.status = "SENT";
            sentCount++;
          } catch (error) {
            logError(`processMailwizardCampaigns`, error, __filename);
            target.status = "FAILED";
          }
        }
      }

      try {
        await updateMailwizardCampaignTargets(
          campaign.id,
          JSON.stringify(targets)
        );

        if (targets.every((target) => target.status !== "PENDING")) {
          await updateMailwizardCampaignStatus(campaign.id, "COMPLETED");
        }
      } catch (error) {
        logError(`processMailwizardCampaigns`, error, __filename);
      }
    }
  } catch (error) {
    logError("processMailwizardCampaigns", error, __filename);
    throw error;
  }
}

export async function updateMailwizardCampaignTargets(id, targets) {
  try {
    await models.mailwizardCampaign.update(
      { targets },
      {
        where: { id },
      }
    );
  } catch (error) {
    logError(`updateMailwizardCampaignTargets`, error, __filename);
    throw error;
  }
}

export async function updateMailwizardCampaignStatus(id, status) {
  try {
    await models.mailwizardCampaign.update(
      { status },
      {
        where: { id },
      }
    );
  } catch (error) {
    logError(`updateMailwizardCampaignStatus`, error, __filename);
    throw error;
  }
}
