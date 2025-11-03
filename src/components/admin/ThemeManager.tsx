import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Palette, ArrowCounterClockwise, Check, Moon, Sun, Sparkles, Brush, Wand } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AppTheme } from '@/lib/types'

// Professional preset themes
const professionalThemes: AppTheme[] = [
  {
    name: 'Professional Blue',
    colors: {
      background: 'oklch(0.99 0.002 240)',
      foreground: 'oklch(0.12 0.015 240)',
      card: 'oklch(1.00 0 0)',
      cardForeground: 'oklch(0.12 0.015 240)',
      popover: 'oklch(1.00 0 0)',
      popoverForeground: 'oklch(0.12 0.015 240)',
      primary: 'oklch(0.45 0.15 250)',
      primaryForeground: 'oklch(0.98 0.002 240)',
      secondary: 'oklch(0.92 0.012 240)',
      secondaryForeground: 'oklch(0.25 0.03 240)',
      accent: 'oklch(0.60 0.12 200)',
      accentForeground: 'oklch(0.98 0.002 240)',
      muted: 'oklch(0.96 0.008 240)',
      mutedForeground: 'oklch(0.50 0.02 240)',
      destructive: 'oklch(0.55 0.22 25)',
      destructiveForeground: 'oklch(0.98 0.002 240)',
      success: 'oklch(0.55 0.15 145)',
      successForeground: 'oklch(0.98 0.002 240)',
      warning: 'oklch(0.70 0.15 65)',
      warningForeground: 'oklch(0.20 0.03 65)',
      border: 'oklch(0.90 0.005 240)',
      input: 'oklch(0.94 0.008 240)',
      ring: 'oklch(0.45 0.15 250)',
    },
    radius: '0.5rem'
  },
  {
    name: 'Modern Emerald',
    colors: {
      background: 'oklch(0.99 0.003 160)',
      foreground: 'oklch(0.15 0.02 160)',
      card: 'oklch(1.00 0 0)',
      cardForeground: 'oklch(0.15 0.02 160)',
      popover: 'oklch(1.00 0 0)',
      popoverForeground: 'oklch(0.15 0.02 160)',
      primary: 'oklch(0.52 0.18 160)',
      primaryForeground: 'oklch(0.98 0.003 160)',
      secondary: 'oklch(0.94 0.01 160)',
      secondaryForeground: 'oklch(0.25 0.03 160)',
      accent: 'oklch(0.65 0.14 180)',
      accentForeground: 'oklch(0.98 0.003 160)',
      muted: 'oklch(0.96 0.006 160)',
      mutedForeground: 'oklch(0.48 0.02 160)',
      destructive: 'oklch(0.58 0.20 25)',
      destructiveForeground: 'oklch(0.98 0.003 160)',
      success: 'oklch(0.55 0.16 145)',
      successForeground: 'oklch(0.98 0.003 160)',
      warning: 'oklch(0.68 0.16 70)',
      warningForeground: 'oklch(0.18 0.03 70)',
      border: 'oklch(0.91 0.005 160)',
      input: 'oklch(0.94 0.006 160)',
      ring: 'oklch(0.52 0.18 160)',
    },
    radius: '0.75rem'
  },
  {
    name: 'Dark Professional',
    colors: {
      background: 'oklch(0.08 0.006 240)',
      foreground: 'oklch(0.95 0.004 240)',
      card: 'oklch(0.12 0.008 240)',
      cardForeground: 'oklch(0.95 0.004 240)',
      popover: 'oklch(0.12 0.008 240)',
      popoverForeground: 'oklch(0.95 0.004 240)',
      primary: 'oklch(0.60 0.16 250)',
      primaryForeground: 'oklch(0.08 0.006 240)',
      secondary: 'oklch(0.18 0.01 240)',
      secondaryForeground: 'oklch(0.85 0.006 240)',
      accent: 'oklch(0.65 0.14 200)',
      accentForeground: 'oklch(0.08 0.006 240)',
      muted: 'oklch(0.15 0.008 240)',
      mutedForeground: 'oklch(0.60 0.008 240)',
      destructive: 'oklch(0.65 0.20 25)',
      destructiveForeground: 'oklch(0.95 0.004 240)',
      success: 'oklch(0.60 0.16 145)',
      successForeground: 'oklch(0.08 0.006 240)',
      warning: 'oklch(0.75 0.16 65)',
      warningForeground: 'oklch(0.08 0.006 240)',
      border: 'oklch(0.20 0.01 240)',
      input: 'oklch(0.18 0.01 240)',
      ring: 'oklch(0.60 0.16 250)',
    },
    radius: '0.5rem'
  },
  {
    name: 'Sophisticated Purple',
    colors: {
      background: 'oklch(0.99 0.003 300)',
      foreground: 'oklch(0.13 0.02 300)',
      card: 'oklch(1.00 0 0)',
      cardForeground: 'oklch(0.13 0.02 300)',
      popover: 'oklch(1.00 0 0)',
      popoverForeground: 'oklch(0.13 0.02 300)',
      primary: 'oklch(0.48 0.16 280)',
      primaryForeground: 'oklch(0.98 0.003 300)',
      secondary: 'oklch(0.93 0.01 300)',
      secondaryForeground: 'oklch(0.25 0.03 300)',
      accent: 'oklch(0.62 0.14 320)',
      accentForeground: 'oklch(0.98 0.003 300)',
      muted: 'oklch(0.96 0.006 300)',
      mutedForeground: 'oklch(0.50 0.02 300)',
      destructive: 'oklch(0.56 0.21 25)',
      destructiveForeground: 'oklch(0.98 0.003 300)',
      success: 'oklch(0.54 0.16 145)',
      successForeground: 'oklch(0.98 0.003 300)',
      warning: 'oklch(0.69 0.16 65)',
      warningForeground: 'oklch(0.19 0.03 65)',
      border: 'oklch(0.91 0.005 300)',
      input: 'oklch(0.94 0.006 300)',
      ring: 'oklch(0.48 0.16 280)',
    },
    radius: '0.625rem'
  }
];

export function ThemeManager() {
  const { t } = useTranslation()
  const { theme, updateTheme, resetTheme } = useTheme()
  const [editedColors, setEditedColors] = useState(theme.colors)
  const [editedRadius, setEditedRadius] = useState(theme.radius)
  const [customColor, setCustomColor] = useState('')

  const handleColorChange = (key: keyof typeof editedColors, value: string) => {
    setEditedColors(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleApplyChanges = () => {
    updateTheme({
      colors: editedColors,
      radius: editedRadius
    })
    toast.success('Theme updated successfully!')
  }

  const handleApplyPreset = (preset: AppTheme) => {
    updateTheme(preset)
    setEditedColors(preset.colors)
    setEditedRadius(preset.radius)
    toast.success(`Applied ${preset.name} theme`)
  }

  const handleCustomColorUpdate = (colorKey: string) => {
    if (customColor) {
      const newColors = { ...editedColors, [colorKey]: customColor }
      setEditedColors(newColors)
      updateTheme({ colors: newColors })
      toast.success(`Updated ${colorKey} color`)
      setCustomColor('')
    }
  }

  const handleRadiusChange = (radius: string) => {
    setEditedRadius(radius)
    updateTheme({ radius })
    toast.success('Border radius updated')
  }

  const handleReset = () => {
    resetTheme()
    setEditedColors(professionalThemes[0].colors)
    setEditedRadius(professionalThemes[0].radius)
    toast.success('Theme reset to default')
  }

  const presetColors = [
    { name: 'Professional Blue', value: 'oklch(0.45 0.15 250)' },
    { name: 'Emerald Green', value: 'oklch(0.52 0.18 160)' },
    { name: 'Royal Purple', value: 'oklch(0.48 0.16 280)' },
    { name: 'Sunset Orange', value: 'oklch(0.65 0.18 50)' },
    { name: 'Deep Teal', value: 'oklch(0.50 0.16 190)' },
    { name: 'Ruby Red', value: 'oklch(0.55 0.20 25)' },
  ]

  const colorGroups = [
    {
      title: 'Base Colors',
      colors: [
        { key: 'background', label: 'Background' },
        { key: 'foreground', label: 'Foreground' },
        { key: 'card', label: 'Card Background' },
        { key: 'cardForeground', label: 'Card Text' },
      ]
    },
    {
      title: 'Brand Colors',
      colors: [
        { key: 'primary', label: 'Primary' },
        { key: 'primaryForeground', label: 'Primary Text' },
        { key: 'secondary', label: 'Secondary' },
        { key: 'secondaryForeground', label: 'Secondary Text' },
        { key: 'accent', label: 'Accent' },
        { key: 'accentForeground', label: 'Accent Text' },
      ]
    },
    {
      title: 'Status Colors',
      colors: [
        { key: 'success', label: 'Success' },
        { key: 'successForeground', label: 'Success Text' },
        { key: 'warning', label: 'Warning' },
        { key: 'warningForeground', label: 'Warning Text' },
        { key: 'destructive', label: 'Destructive' },
        { key: 'destructiveForeground', label: 'Destructive Text' },
      ]
    },
    {
      title: 'UI Elements',
      colors: [
        { key: 'muted', label: 'Muted Background' },
        { key: 'mutedForeground', label: 'Muted Text' },
        { key: 'border', label: 'Border' },
        { key: 'input', label: 'Input Background' },
        { key: 'ring', label: 'Focus Ring' },
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Theme Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles size={20} weight="bold" />
            Current Theme Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="px-3 py-1 text-sm">
              {theme.name}
            </Badge>
            <div className="flex gap-1">
              <div 
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm" 
                style={{ backgroundColor: theme.colors.primary }}
                title="Primary"
              />
              <div 
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm" 
                style={{ backgroundColor: theme.colors.accent }}
                title="Accent"
              />
              <div 
                className="w-6 h-6 rounded-full border-2 border-white shadow-sm" 
                style={{ backgroundColor: theme.colors.success }}
                title="Success"
              />
            </div>
          </div>
          
          {/* Live Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border">
            <div 
              className="p-4 rounded shadow-sm"
              style={{ 
                backgroundColor: theme.colors.card,
                color: theme.colors.cardForeground,
                borderRadius: theme.radius 
              }}
            >
              <h4 className="font-semibold mb-2">Sample Card</h4>
              <p className="text-sm opacity-80">This is how cards will look</p>
            </div>
            <div 
              className="p-3 rounded text-center font-medium"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.primaryForeground,
                borderRadius: theme.radius 
              }}
            >
              Primary Button
            </div>
            <div 
              className="p-3 rounded text-center font-medium"
              style={{ 
                backgroundColor: theme.colors.success,
                color: theme.colors.successForeground,
                borderRadius: theme.radius 
              }}
            >
              Success State
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="presets" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="presets">
            <Palette size={16} className="mr-2" />
            Preset Themes
          </TabsTrigger>
          <TabsTrigger value="custom">
            <Brush size={16} className="mr-2" />
            Custom Colors
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Wand size={16} className="mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {professionalThemes.map((preset) => (
              <Card 
                key={preset.name}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  theme.name === preset.name ? 'ring-2 ring-primary shadow-md' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-lg">{preset.name}</h3>
                    {theme.name === preset.name && (
                      <Check size={20} weight="bold" className="text-primary" />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-6 gap-2 mb-4">
                    {[
                      preset.colors.primary,
                      preset.colors.secondary,
                      preset.colors.accent,
                      preset.colors.success,
                      preset.colors.warning,
                      preset.colors.destructive
                    ].map((color, index) => (
                      <div 
                        key={index}
                        className="h-8 rounded border shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => handleApplyPreset(preset)}
                    className="w-full"
                    variant={theme.name === preset.name ? 'default' : 'outline'}
                  >
                    {theme.name === preset.name ? 'Active' : 'Apply Theme'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6 mt-6">
          {/* Quick Color Update */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Color Update</CardTitle>
              <CardDescription>Enter an OKLCH color value to update any color</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="oklch(0.65 0.18 250)"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={() => setCustomColor('')}
                  disabled={!customColor}
                >
                  Clear
                </Button>
              </div>
              
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {['primary', 'accent', 'success', 'warning', 'destructive', 'border'].map((colorKey) => (
                  <Button
                    key={colorKey}
                    size="sm"
                    variant="outline"
                    onClick={() => handleCustomColorUpdate(colorKey)}
                    disabled={!customColor}
                    className="capitalize"
                  >
                    {colorKey}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Preset Colors</Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {presetColors.map((preset) => (
                    <button
                      key={preset.name}
                      className="w-full h-10 rounded border-2 border-muted hover:border-primary transition-colors"
                      style={{ backgroundColor: preset.value }}
                      onClick={() => setCustomColor(preset.value)}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Color Groups */}
          {colorGroups.map((group) => (
            <Card key={group.title}>
              <CardHeader>
                <CardTitle className="text-lg">{group.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.colors.map((color) => (
                    <div key={color.key} className="space-y-2">
                      <Label className="text-sm font-medium">{color.label}</Label>
                      <div className="flex gap-2">
                        <div
                          className="w-12 h-10 rounded-md border-2 border-muted shrink-0 shadow-sm"
                          style={{ backgroundColor: editedColors[color.key as keyof typeof editedColors] }}
                        />
                        <Input
                          type="text"
                          value={editedColors[color.key as keyof typeof editedColors]}
                          onChange={(e) => handleColorChange(color.key as keyof typeof editedColors, e.target.value)}
                          placeholder="oklch(0.5 0.2 180)"
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 mt-6">
          {/* Border Radius */}
          <Card>
            <CardHeader>
              <CardTitle>Border Radius</CardTitle>
              <CardDescription>Customize the roundness of UI elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current: {editedRadius}</Label>
                <div className="grid grid-cols-5 gap-2">
                  {['0rem', '0.25rem', '0.5rem', '0.75rem', '1rem'].map((radius) => (
                    <Button
                      key={radius}
                      variant={editedRadius === radius ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleRadiusChange(radius)}
                      className="text-xs"
                    >
                      {radius}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-muted rounded-lg">
                <div 
                  className="w-16 h-16 bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium"
                  style={{ borderRadius: editedRadius }}
                >
                  Preview
                </div>
                <div className="space-y-2">
                  <div 
                    className="px-3 py-1 bg-accent text-accent-foreground text-sm"
                    style={{ borderRadius: editedRadius }}
                  >
                    Button Style
                  </div>
                  <div 
                    className="w-24 h-8 bg-card border border-border"
                    style={{ borderRadius: editedRadius }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Theme Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleApplyChanges} className="flex items-center gap-2">
                  <Check size={18} weight="bold" />
                  Apply Changes
                </Button>
                
                <Button onClick={handleReset} variant="outline" className="flex items-center gap-2">
                  <ArrowCounterClockwise size={18} weight="bold" />
                  Reset to Default
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(theme, null, 2))
                    toast.success('Theme configuration copied to clipboard')
                  }}
                  className="flex items-center gap-2"
                >
                  Copy Config
                </Button>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>OKLCH Color Format:</strong> Use oklch(lightness chroma hue) for better color consistency. 
                  Lightness: 0-1, Chroma: 0-0.37, Hue: 0-360. 
                  Example: oklch(0.65 0.18 250) for a professional blue.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
