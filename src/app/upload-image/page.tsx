// app/UploadImage/page.tsx
import ImageUploader from "@/components/image-uploader";

export default function UploadImagePage() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">上傳飲食照片</h1>
      <ImageUploader />
    </div>
  );
}
