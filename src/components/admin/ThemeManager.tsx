import React from 'react';
import { useTheme } from '@/hooks/use-theme';
import { availableThemes, type ThemeId } from '@/lib/theme-constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export function ThemeManager() {
  const { theme, setTheme, isDarkMode, setIsDarkMode, resetTheme, getThemeData } = useTheme();
  
  const currentThemeData = getThemeData();
  const themeEntries = Object.entries(availableThemes) as [ThemeId, typeof availableThemes[ThemeId]][];

  const handlePresetChange = (themeId: ThemeId) => {
    setTheme(themeId);
  };

  return (
    <Card className="admin-card">
      <CardHeader>
        <CardTitle>Theme Management</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Current Theme: {currentThemeData.name}</Label>
          
          <div className="space-y-2">
            <Label>Select Theme</Label>
            <Select value={theme} onValueChange={handlePresetChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {themeEntries.map(([themeId, themeData]) => (
                  <SelectItem key={themeId} value={themeId}>
                    {themeData.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
            />
            <Label>Dark Mode</Label>
          </div>

          <Button onClick={resetTheme} variant="outline">
            Reset to Default
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}