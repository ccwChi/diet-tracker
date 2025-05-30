"use client";

import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";

export default function ImageUploader() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "ready" | "uploading" | "done">("idle");

  const compressToWebP = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      fileType: "image/webp",
    };
    const compressed = await imageCompression(file, options);
    return new File([compressed], file.name.replace(/\.\w+$/, ".webp"), {
      type: "image/webp",
    });
  };

  const handleFile = useCallback(async (file: File) => {
    const compressed = await compressToWebP(file);
    setOriginalFile(compressed);
    setPreview(URL.createObjectURL(compressed));
    setStatus("ready");
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!originalFile) return;
    setUploading(true);
    setStatus("uploading");

    const res = await fetch(`/api/upload-url?filename=${originalFile.name}`);
    const { url } = await res.json();

    await fetch(url, {
      method: "PUT",
      body: originalFile,
      headers: {
        "Content-Type": "image/webp",
        "x-amz-acl": "public-read",
      },
    });

    const imageUrl = url.split("?")[0];
    // 這裡送給後端儲存使用者資料（你可以改成自己的 API）
    await fetch("/api/save-user-image", {
      method: "POST",
      body: JSON.stringify({ imageUrl }),
      headers: { "Content-Type": "application/json" },
    });

    setUploading(false);
    setStatus("done");
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:bg-gray-50"
      >
        <p className="mb-2">拖拉圖片到這裡，或</p>
        <label htmlFor="imageInput" className="text-blue-600 underline cursor-pointer">
          點擊選擇圖片
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={onSelect}
          className="hidden"
          id="imageInput"
        />
      </div>

      {preview && (
        <div className="flex flex-col items-center space-y-2">
          <img src={preview} alt="預覽圖" className="rounded shadow max-h-60" />
          {status === "ready" && (
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              確認上傳
            </button>
          )}
        </div>
      )}

      {status === "uploading" && (
        <p className="text-yellow-500 text-center">上傳中...</p>
      )}
      {status === "done" && (
        <p className="text-green-600 text-center">✅ 上傳完成，已儲存圖片連結</p>
      )}
    </div>
  );
}
