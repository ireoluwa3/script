import { models } from "@b/db";
import { Op } from "sequelize";
import { logError } from "../logger";

export async function processIcoPhases() {
  try {
    const phases = await getIcoPhases();

    const currentDate = new Date();

    for (const phase of phases) {
      try {
        if (currentDate >= phase.endDate && phase.status === "ACTIVE") {
          await updatePhaseStatus(phase.id, "COMPLETED");
        } else if (
          currentDate >= phase.startDate &&
          phase.status === "PENDING"
        ) {
          await updatePhaseStatus(phase.id, "ACTIVE");
        }
      } catch (error) {
        logError(`processIcoPhases`, error, __filename);
      }
    }
  } catch (error) {
    logError("processIcoPhases", error, __filename);
    throw error;
  }
}

export async function getIcoPhases() {
  try {
    return await models.icoPhase.findAll({
      where: {
        [Op.or]: [{ status: "PENDING" }, { status: "ACTIVE" }],
      },
      include: [
        {
          model: models.icoToken,
          as: "token",
        },
      ],
    });
  } catch (error) {
    logError("getIcoPhases", error, __filename);
    throw error;
  }
}

export async function updatePhaseStatus(id, status) {
  try {
    await models.icoPhase.update(
      { status },
      {
        where: { id },
      }
    );
  } catch (error) {
    logError(`updatePhaseStatus`, error, __filename);
    throw error;
  }
}
