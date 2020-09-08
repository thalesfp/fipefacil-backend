import { getReferences } from "../services/fipeApi";
import { normalizeReferences } from "../transformers/valuesFromRemoteApi";
import { getCurrentReference } from "../repository/references";
import sendMessage from "../queue/referencesQueue";
import { PriceReferenceType } from "../types/Types";

const getLastRemoteReference = (
  references: PriceReferenceType[],
): PriceReferenceType =>
  references.reduce((prev, current) => (prev.id > current.id ? prev : current));

const checkForUpdate = async (): Promise<boolean> => {
  const references = await getReferences();
  const referencesNormalized = normalizeReferences(references);
  const lastRemoteReference = getLastRemoteReference(referencesNormalized);
  const currentReferenceId = await getCurrentReference();

  if (
    !currentReferenceId ||
    lastRemoteReference.id > parseInt(currentReferenceId.pk, 10)
  ) {
    await sendMessage(lastRemoteReference);

    return true;
  }

  return false;
};

export default checkForUpdate;
