import zlib from "zlib";

export const compressStringToZip = (string: string): Buffer => {
  const buffer = Buffer.from(string);

  return zlib.gzipSync(buffer);
};

export const decompressZipToString = (buffer: Buffer): string => {
  const decompressed = zlib.gunzipSync(buffer);

  return Buffer.from(decompressed).toString();
};
