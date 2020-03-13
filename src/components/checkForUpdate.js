const api = require("../fipeApi");
const { getCurrentReferenceId } = require("../repository/references");
const { sendMessage } = require("../queue/referencesQueue");
const { extractDateFromRemoteReference } = require("../transformers/reference");

const getLastRemoteReference = references =>
  references.reduce(
    (prev, current) => (prev.id > current.id ? prev : current),
    [],
  );

const checkForUpdate = async () => {
  const references = await api.getReferences();

  const formatedReferences = references.map(reference => ({
    id: reference.Codigo,
    ...extractDateFromRemoteReference(reference.Mes),
  }));

  const lastRemoteReference = getLastRemoteReference(formatedReferences);
  const currentReferenceId = await getCurrentReferenceId();

  if (lastRemoteReference.id > currentReferenceId) {
    const { id, month, year } = lastRemoteReference;
    await sendMessage(id, month, year);
  }
};

module.exports = checkForUpdate;
