"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Settings, Coins } from "lucide-react";

export default function AdminSettingsPage() {
  const [currency, setCurrency] = useState("IRR");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch("/api/settings");
        if (response.ok) {
          const data = await response.json();
          if (data.currency) {
            setCurrency(data.currency);
          }
        } else {
          toast.error("Failed to load settings");
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast.error("An error occurred while loading settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "currency",
          value: currency,
        }),
      });

      if (response.ok) {
        toast.success("Settings saved successfully");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("An error occurred while saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 animate-spin" />
            Settings
          </h1>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8 text-blue-500" />
          Global Settings
        </h1>
        <p className="text-gray-600">Configure global settings for your Jahat platform</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-500" />
              <CardTitle>Currency Settings</CardTitle>
            </div>
            <CardDescription>
              Choose the global currency displayed on course lists and detail pages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Primary Site Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full md:w-1/2 p-2 border border-gray-300 rounded-md bg-background focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="IRR">IRR (Iranian Rial - ریال)</option>
                <option value="IRT">IRT (Iranian Toman - تومان)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Note: Course prices in the database are stored in Rials (IRR). If set to Toman (IRT), values will be divided by 10 for display purposes.
              </p>
            </div>

            <div className="pt-4 border-t flex justify-end">
              <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
