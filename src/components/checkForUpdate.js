const api = require("../fipeApi");
const {
  createReference,
  getCurrentReferenceId,
} = require("../repository/references");
const { sendMessage } = require("../queue/referencesQueue");
const { normalizeReferences } = require("../transformers/valuesFromRemoteApi");

const getLastRemoteReference = (references) =>
  references.reduce(
    (prev, current) => (prev.id > current.id ? prev : current),
    [],
  );

const checkForUpdate = async () => {
  const references = await api.getReferences();

  const referencesNormalized = normalizeReferences(references);

  const lastRemoteReference = getLastRemoteReference(referencesNormalized);
  const currentReferenceId = await getCurrentReferenceId();

  if (lastRemoteReference.id > currentReferenceId) {
    const { id, month, year } = lastRemoteReference;

    await sendMessage({ id, month, year });
    await createReference(id, month, year);
  }
};

module.exports = { checkForUpdate };
