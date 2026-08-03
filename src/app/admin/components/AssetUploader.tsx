"use client";

import { useState, useRef } from "react";
import { uploadAssetAction, checkAssetExistsAction } from "../actions";
import { FieldControl } from "../../../components/FieldControl";
import { Button } from "../../../components/Button";

export function AssetUploader({ onUploadComplete }: { onUploadComplete?: (url: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccessMsg(null);
    const selected = e.target.files?.[0];
    if (!selected) return;
    
    // Validate size (5MB max)
    if (selected.size > 5 * 1024 * 1024) {
      setError("File exceeds 5MB size limit.");
      return;
    }

    setFile(selected);
    
    // Generate object URL for preview
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(URL.createObjectURL(selected));

    // Default file name (slugified without extension initially)
    const nameWithoutExt = selected.name.substring(0, selected.name.lastIndexOf('.')) || selected.name;
    const ext = selected.name.substring(selected.name.lastIndexOf('.'));
    setFileName(slugify(nameWithoutExt) + ext);
  };

  const handleNameChange = (val: string) => {
    setFileName(val);
  };

  const formatFileName = (name: string, originalFile: File) => {
    const extMatch = name.match(/\.[0-9a-z]+$/i);
    const originalExt = originalFile.name.substring(originalFile.name.lastIndexOf('.'));
    
    let nameWithoutExt = name;
    let ext = originalExt;

    if (extMatch) {
      nameWithoutExt = name.substring(0, name.length - extMatch[0].length);
      ext = extMatch[0].toLowerCase();
    }
    
    return slugify(nameWithoutExt) + ext;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setError(null);
    setSuccessMsg(null);
    setIsUploading(true);

    try {
      const finalName = formatFileName(fileName, file);
      setFileName(finalName);

      // Check for duplicate
      const exists = await checkAssetExistsAction(finalName);
      let overwrite = false;
      
      if (exists) {
        const confirmOverwrite = window.confirm(
          `A file named "${finalName}" already exists. Do you want to overwrite it?\nClick OK to overwrite, or Cancel to automatically append a suffix instead.`
        );
        if (confirmOverwrite) {
          overwrite = true;
        } else {
          // Append timestamp suffix
          const ext = finalName.substring(finalName.lastIndexOf('.'));
          const nameWithoutExt = finalName.substring(0, finalName.lastIndexOf('.'));
          const newName = `${nameWithoutExt}-${Date.now()}${ext}`;
          setFileName(newName);
          // Now proceed with newName, which should be unique
          await upload(file, newName, false);
          return;
        }
      }

      await upload(file, finalName, overwrite);
    } catch (err: any) {
      setError(err.message || "An error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const upload = async (fileToUpload: File, name: string, overwrite: boolean) => {
    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("fileName", name);
    formData.append("overwrite", String(overwrite));

    const result = await uploadAssetAction(formData);
    if (result.success) {
      setSuccessMsg(`File successfully uploaded: ${name}`);
      setFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      if (onUploadComplete) {
        onUploadComplete(result.url);
      }
    }
  };

  return (
    <div className="p-6 border rounded-lg" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
      <h3 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>Upload Asset</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-primary)" }}>Select File (JPG, PNG, SVG)</label>
          <input 
            type="file" 
            ref={fileInputRef}
            accept=".jpg,.jpeg,.png,.svg,image/jpeg,image/png,image/svg+xml"
            onChange={handleFileChange}
            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[var(--accent)] file:text-[var(--bg-primary)] hover:file:opacity-90"
            style={{ color: "var(--text-primary)" }}
          />
          <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>Max file size: 5MB</p>
        </div>

        {previewUrl && (
          <div className="mt-4 border rounded overflow-hidden relative group" style={{ borderColor: "var(--border)", maxWidth: "200px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview" className="w-full h-auto object-cover max-h-48" />
          </div>
        )}

        {file && (
          <div className="space-y-4 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
            <FieldControl
              label="File Name"
              type="text"
              value={fileName}
              onChange={handleNameChange}
              placeholder="e.g. my-cool-image.png"
              description="Name will be automatically slugified on upload"
              required
            />
            
            <Button type="submit" disabled={isUploading} className="w-full">
              {isUploading ? "Uploading..." : "Upload Asset"}
            </Button>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-100 text-red-700 text-sm rounded border border-red-200">
            {error}
          </div>
        )}
        
        {successMsg && (
          <div className="p-3 bg-green-100 text-green-700 text-sm rounded border border-green-200">
            {successMsg}
          </div>
        )}
      </form>
    </div>
  );
}
