"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/lib/hooks/use-supabase-auth";
import { Loader2, Upload, Calendar, BarChart } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FileUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const { session } = useSupabaseAuth();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [filteredFiles, setFilteredFiles] = useState<any[]>([]);
  const [usageStats, setUsageStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("upload");

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
      // Add timestamp for tracking
      formData.append("uploadDate", new Date().toISOString());

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.url) {
        setUploadedUrl(data.url);
        // Refresh usage stats after successful upload
        fetchUsageStats();
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const fetchFilteredFiles = async () => {
    if (!session?.user) return;
    
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate.toISOString());
      if (endDate) params.append("endDate", endDate.toISOString());
      
      const response = await fetch(`/api/files/history?${params.toString()}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      setFilteredFiles(data.files || []);
    } catch (error) {
      console.error("Failed to fetch file history:", error);
    }
  };

  const fetchUsageStats = async () => {
    if (!session?.user) return;
    
    try {
      const response = await fetch("/api/usage/stats", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      setUsageStats(data);
    } catch (error) {
      console.error("Failed to fetch usage stats:", error);
    }
  };

  // Fetch usage stats on initial load
  useState(() => {
    if (session?.user) {
      fetchUsageStats();
    }
  });

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="stats">Usage Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Files</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>File History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <DatePicker date={startDate} setDate={setStartDate} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">End Date</label>
                    <DatePicker date={endDate} setDate={setEndDate} />
                  </div>
                  <Button 
                    className="self-end" 
                    onClick={fetchFilteredFiles}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
                
                {filteredFiles.length > 0 ? (
                  <div className="border rounded-md divide-y">
                    {filteredFiles.map((file) => (
                      <div key={file.id} className="p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{file.file_name}</p>
                          <p className="text-sm text-zinc-500">
                            {new Date(file.created_at).toLocaleString()}
                          </p>
                        </div>
                        <a 
                          href={file.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-zinc-500 py-8">
                    No files found for the selected date range
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {usageStats ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Daily Activity</h3>
                    <div className="h-40 bg-zinc-100 dark:bg-zinc-800 rounded-md p-4">
                      {/* Placeholder for daily chart - would use Recharts or similar */}
                      <div className="flex items-end justify-between h-full">
                        {usageStats.daily?.map((day: any, i: number) => (
                          <div key={i} className="flex flex-col items-center">
                            <div 
                              className="bg-blue-500 w-6" 
                              style={{ height: `${(day.count / usageStats.maxDaily) * 100}%` }}
                            ></div>
                            <span className="text-xs mt-1">{day.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Monthly Summary</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md">
                        <p className="text-sm text-zinc-500">Total Uploads</p>
                        <p className="text-2xl font-bold">{usageStats.monthly?.totalUploads || 0}</p>
                      </div>
                      <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-md">
                        <p className="text-sm text-zinc-500">Storage Used</p>
                        <p className="text-2xl font-bold">{usageStats.monthly?.storageUsed || '0 MB'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}