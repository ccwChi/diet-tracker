import imageCompression from "browser-image-compression";

export async function compressAndConvertToWebp(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
    fileType: "image/webp",
  };

  const compressedBlob = await imageCompression(file, options);
  const webpFile = new File(
    [compressedBlob],
    file.name.replace(/\.\w+$/, ".webp"),
    { type: "image/webp" }
  );
  return webpFile;
}
