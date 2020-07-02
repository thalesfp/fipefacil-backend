import zlib from "zlib";

export const compressStringToZip = (string: string): Buffer => {
  const buffer = Buffer.from(string);

  return zlib.gzipSync(buffer);
};
