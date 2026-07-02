'use client';

import { useState, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import { Loader2, Upload, X, Link as LinkIcon, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function FileUpload({
  value,
  onChange,
  accept = "*/*",
  placeholder = "Paste file URL or upload...",
  disabled
}: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    setIsLoading(true);

    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      onChange(newBlob.url);
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex gap-2 items-center">
        <div className="relative flex-1">
          <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled || isLoading}
            placeholder={placeholder}
            className="pr-9 pl-4"
          />
        </div>
        {value && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={handleRemove}
            disabled={disabled}
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {!value && (
        <div
          onClick={() => !disabled && !isLoading && fileInputRef.current?.click()}
          className={`w-full py-6 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl flex flex-col items-center justify-center transition ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50/50'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              <span>Uploading file...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Upload className="h-4 w-4 text-slate-400" />
              <span>Or click to upload file</span>
            </div>
          )}
        </div>
      )}

      {value && (
        <div className="flex items-center gap-2 p-3 bg-slate-50 border rounded-xl text-xs text-slate-600">
          <FileText className="h-4 w-4 text-[#219ebc] shrink-0" />
          <span className="truncate flex-1">{value}</span>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#219ebc] hover:underline font-semibold"
          >
            Preview
          </a>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleUpload}
        disabled={isLoading || disabled}
      />
    </div>
  );
}
