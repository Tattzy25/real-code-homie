"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/lib/hooks/use-supabase-auth";
import { Loader2, Upload } from "lucide-react";

export function FileUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const { session } = useSupabaseAuth();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !session?.user) {
      return;
    }

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", session.user.id);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.url) {
        setUploadedUrl(data.url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => document.getElementById("file-upload")?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </>
          )}
        </Button>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
      
      {uploadedUrl && (
        <div className="mt-4">
          <p className="text-sm text-zinc-400">File uploaded successfully!</p>
          <a 
            href={uploadedUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm"
          >
            View uploaded file
          </a>
        </div>
      )}
    </div>
  );
}