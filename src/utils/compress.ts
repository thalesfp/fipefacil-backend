import zlib from "zlib";

export const stringToZip = (string: string): Buffer => {
  const buffer = Buffer.from(string);

  return zlib.gzipSync(buffer);
};

export const zipToString = (buffer: Buffer): string => {
  const decompressed = zlib.gunzipSync(buffer);

  return Buffer.from(decompressed).toString();
};
