const { getReferences } = require("../../api/fipeApi");
const { getCurrentReferenceId } = require("../../repository/references");
const { sendMessage } = require("../../queue/referencesQueue");
const {
  normalizeReferences,
} = require("../../transformers/valuesFromRemoteApi");

const getLastRemoteReference = (references) =>
  references.reduce(
    (prev, current) => (prev.id > current.id ? prev : current),
    [],
  );

const checkForUpdate = async ({ apiTimeout }) => {
  const references = await getReferences({ timeout: apiTimeout });

  const referencesNormalized = normalizeReferences(references);

  const lastRemoteReference = getLastRemoteReference(referencesNormalized);
  const currentReferenceId = await getCurrentReferenceId();

  if (lastRemoteReference.id > currentReferenceId) {
    const { id, month, year } = lastRemoteReference;

    await sendMessage({ id, month, year });
  }
};

module.exports = { checkForUpdate };
