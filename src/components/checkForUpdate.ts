import { getReferences } from "../api/fipeApi";
import { normalizeReferences } from "../transformers/valuesFromRemoteApi";
import { getCurrentReferenceId } from "../repository/references";
import sendMessage from "../queue/referencesQueue";

const getLastRemoteReference = (references: ReferenceType[]): ReferenceType =>
  references.reduce((prev, current) => (prev.id > current.id ? prev : current));

const checkForUpdate = async (): Promise<void> => {
  const references = await getReferences();
  const referencesNormalized = normalizeReferences(references);
  const lastRemoteReference = getLastRemoteReference(referencesNormalized);
  const currentReferenceId = await getCurrentReferenceId();

  if (!currentReferenceId || lastRemoteReference.id > currentReferenceId) {
    await sendMessage(lastRemoteReference);
  }
};

export default checkForUpdate;
