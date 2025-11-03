import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/contexts/ThemeContext'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Palette, ArrowCounterClockwise, Check } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AppTheme } from '@/lib/types'

const presetThemes: AppTheme[] = [
  {
    name: 'Modern Green',
    colors: {
      background: 'oklch(0.98 0.01 180)',
      foreground: 'oklch(0.15 0.02 240)',
      card: 'oklch(0.99 0.005 180)',
      cardForeground: 'oklch(0.15 0.02 240)',
      popover: 'oklch(1.00 0 0)',
      popoverForeground: 'oklch(0.15 0.02 240)',
      primary: 'oklch(0.65 0.20 160)',
      primaryForeground: 'oklch(0.98 0.01 180)',
      secondary: 'oklch(0.92 0.08 200)',
      secondaryForeground: 'oklch(0.20 0.05 240)',
      accent: 'oklch(0.75 0.15 280)',
      accentForeground: 'oklch(0.15 0.02 240)',
      muted: 'oklch(0.94 0.02 180)',
      mutedForeground: 'oklch(0.45 0.02 240)',
      destructive: 'oklch(0.65 0.20 25)',
      destructiveForeground: 'oklch(0.98 0.01 180)',
      success: 'oklch(0.55 0.15 145)',
      successForeground: 'oklch(1 0 0)',
      warning: 'oklch(0.70 0.15 65)',
      warningForeground: 'oklch(0.20 0.03 65)',
      border: 'oklch(0.88 0.02 180)',
      input: 'oklch(0.88 0.02 180)',
      ring: 'oklch(0.65 0.20 160)',
    },
    radius: '0.75rem'
  },
  {
    name: 'Ocean Blue',
    colors: {
      background: 'oklch(0.97 0.01 240)',
      foreground: 'oklch(0.15 0.02 240)',
      card: 'oklch(0.98 0.005 240)',
      cardForeground: 'oklch(0.15 0.02 240)',
      popover: 'oklch(1.00 0 0)',
      popoverForeground: 'oklch(0.15 0.02 240)',
      primary: 'oklch(0.55 0.20 240)',
      primaryForeground: 'oklch(0.98 0.01 240)',
      secondary: 'oklch(0.90 0.08 260)',
      secondaryForeground: 'oklch(0.20 0.05 240)',
      accent: 'oklch(0.70 0.15 200)',
      accentForeground: 'oklch(0.15 0.02 240)',
      muted: 'oklch(0.93 0.02 240)',
      mutedForeground: 'oklch(0.45 0.02 240)',
      destructive: 'oklch(0.65 0.20 25)',
      destructiveForeground: 'oklch(0.98 0.01 180)',
      success: 'oklch(0.55 0.15 145)',
      successForeground: 'oklch(1 0 0)',
      warning: 'oklch(0.70 0.15 65)',
      warningForeground: 'oklch(0.20 0.03 65)',
      border: 'oklch(0.87 0.02 240)',
      input: 'oklch(0.87 0.02 240)',
      ring: 'oklch(0.55 0.20 240)',
    },
    radius: '0.75rem'
  },
  {
    name: 'Sunset Orange',
    colors: {
      background: 'oklch(0.98 0.01 60)',
      foreground: 'oklch(0.15 0.02 60)',
      card: 'oklch(0.99 0.005 60)',
      cardForeground: 'oklch(0.15 0.02 60)',
      popover: 'oklch(1.00 0 0)',
      popoverForeground: 'oklch(0.15 0.02 60)',
      primary: 'oklch(0.65 0.20 45)',
      primaryForeground: 'oklch(0.98 0.01 60)',
      secondary: 'oklch(0.92 0.08 60)',
      secondaryForeground: 'oklch(0.20 0.05 60)',
      accent: 'oklch(0.75 0.15 30)',
      accentForeground: 'oklch(0.15 0.02 60)',
      muted: 'oklch(0.94 0.02 60)',
      mutedForeground: 'oklch(0.45 0.02 60)',
      destructive: 'oklch(0.65 0.20 25)',
      destructiveForeground: 'oklch(0.98 0.01 180)',
      success: 'oklch(0.55 0.15 145)',
      successForeground: 'oklch(1 0 0)',
      warning: 'oklch(0.70 0.15 65)',
      warningForeground: 'oklch(0.20 0.03 65)',
      border: 'oklch(0.88 0.02 60)',
      input: 'oklch(0.88 0.02 60)',
      ring: 'oklch(0.65 0.20 45)',
    },
    radius: '0.75rem'
  },
  {
    name: 'Royal Purple',
    colors: {
      background: 'oklch(0.97 0.01 300)',
      foreground: 'oklch(0.15 0.02 300)',
      card: 'oklch(0.98 0.005 300)',
      cardForeground: 'oklch(0.15 0.02 300)',
      popover: 'oklch(1.00 0 0)',
      popoverForeground: 'oklch(0.15 0.02 300)',
      primary: 'oklch(0.60 0.20 300)',
      primaryForeground: 'oklch(0.98 0.01 300)',
      secondary: 'oklch(0.90 0.08 320)',
      secondaryForeground: 'oklch(0.20 0.05 300)',
      accent: 'oklch(0.70 0.15 280)',
      accentForeground: 'oklch(0.15 0.02 300)',
      muted: 'oklch(0.93 0.02 300)',
      mutedForeground: 'oklch(0.45 0.02 300)',
      destructive: 'oklch(0.65 0.20 25)',
      destructiveForeground: 'oklch(0.98 0.01 180)',
      success: 'oklch(0.55 0.15 145)',
      successForeground: 'oklch(1 0 0)',
      warning: 'oklch(0.70 0.15 65)',
      warningForeground: 'oklch(0.20 0.03 65)',
      border: 'oklch(0.87 0.02 300)',
      input: 'oklch(0.87 0.02 300)',
      ring: 'oklch(0.60 0.20 300)',
    },
    radius: '0.75rem'
  }
]

export function ThemeManager() {
  const { t } = useTranslation()
  const { theme, updateTheme, resetTheme } = useTheme()
  const [editedColors, setEditedColors] = useState(theme.colors)
  const [editedRadius, setEditedRadius] = useState(theme.radius)

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
    toast.success(t('admin.themeUpdated'))
  }

  const handleApplyPreset = (preset: AppTheme) => {
    updateTheme(preset)
    setEditedColors(preset.colors)
    setEditedRadius(preset.radius)
    toast.success(t('admin.themePresetApplied', { name: preset.name }))
  }

  const handleReset = () => {
    resetTheme()
    setEditedColors(presetThemes[0].colors)
    setEditedRadius(presetThemes[0].radius)
    toast.success(t('admin.themeReset'))
  }

  const colorGroups = [
    {
      title: 'Base Colors',
      colors: [
        { key: 'background', label: 'Background' },
        { key: 'foreground', label: 'Foreground' },
        { key: 'card', label: 'Card' },
        { key: 'cardForeground', label: 'Card Foreground' },
      ]
    },
    {
      title: 'Action Colors',
      colors: [
        { key: 'primary', label: 'Primary' },
        { key: 'primaryForeground', label: 'Primary Foreground' },
        { key: 'secondary', label: 'Secondary' },
        { key: 'secondaryForeground', label: 'Secondary Foreground' },
        { key: 'accent', label: 'Accent' },
        { key: 'accentForeground', label: 'Accent Foreground' },
      ]
    },
    {
      title: 'Status Colors',
      colors: [
        { key: 'destructive', label: 'Destructive' },
        { key: 'destructiveForeground', label: 'Destructive Foreground' },
        { key: 'success', label: 'Success' },
        { key: 'successForeground', label: 'Success Foreground' },
        { key: 'warning', label: 'Warning' },
        { key: 'warningForeground', label: 'Warning Foreground' },
      ]
    },
    {
      title: 'UI Elements',
      colors: [
        { key: 'muted', label: 'Muted' },
        { key: 'mutedForeground', label: 'Muted Foreground' },
        { key: 'border', label: 'Border' },
        { key: 'input', label: 'Input' },
        { key: 'ring', label: 'Ring' },
      ]
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette size={24} weight="bold" />
          {t('admin.themeSettings')}
        </CardTitle>
        <CardDescription>{t('admin.themeSettingsDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">{t('admin.presetThemes')}</TabsTrigger>
            <TabsTrigger value="custom">{t('admin.customTheme')}</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {presetThemes.map((preset) => (
                <Card 
                  key={preset.name}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2"
                  style={{
                    borderColor: theme.name === preset.name ? 'var(--primary)' : 'var(--border)'
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-semibold text-lg">{preset.name}</h3>
                      {theme.name === preset.name && (
                        <Check size={20} weight="bold" className="text-primary" />
                      )}
                    </div>
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      <div 
                        className="h-12 rounded-md border"
                        style={{ backgroundColor: preset.colors.primary }}
                        title="Primary"
                      />
                      <div 
                        className="h-12 rounded-md border"
                        style={{ backgroundColor: preset.colors.secondary }}
                        title="Secondary"
                      />
                      <div 
                        className="h-12 rounded-md border"
                        style={{ backgroundColor: preset.colors.accent }}
                        title="Accent"
                      />
                      <div 
                        className="h-12 rounded-md border"
                        style={{ backgroundColor: preset.colors.success }}
                        title="Success"
                      />
                      <div 
                        className="h-12 rounded-md border"
                        style={{ backgroundColor: preset.colors.warning }}
                        title="Warning"
                      />
                    </div>
                    <Button 
                      onClick={() => handleApplyPreset(preset)}
                      className="w-full"
                      variant={theme.name === preset.name ? 'default' : 'outline'}
                    >
                      {theme.name === preset.name ? t('common.active') : t('common.apply')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label>{t('admin.borderRadius')}</Label>
              <Input
                type="text"
                value={editedRadius}
                onChange={(e) => setEditedRadius(e.target.value)}
                placeholder="0.75rem"
              />
            </div>

            {colorGroups.map((group) => (
              <div key={group.title} className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">{group.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.colors.map((color) => (
                    <div key={color.key} className="space-y-2">
                      <Label>{color.label}</Label>
                      <div className="flex gap-2">
                        <div
                          className="w-12 h-10 rounded-md border shrink-0"
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
              </div>
            ))}

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={handleApplyChanges} className="flex-1">
                <Check size={18} weight="bold" className="mr-2" />
                {t('common.applyChanges')}
              </Button>
              <Button onClick={handleReset} variant="outline">
                <ArrowCounterClockwise size={18} weight="bold" className="mr-2" />
                {t('common.reset')}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
