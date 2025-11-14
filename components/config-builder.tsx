'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'

export interface ConfigItem {
  key: string
  value: string
  type: 'string' | 'number' | 'boolean' | 'color'
}

interface ConfigBuilderProps {
  config: Record<string, any>
  onChange: (config: Record<string, any>) => void
}

const CONFIG_TYPES = [
  { value: 'string', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'True/False' },
  { value: 'color', label: 'Color' },
]

export function ConfigBuilder({ config, onChange }: ConfigBuilderProps) {
  const [items, setItems] = useState<ConfigItem[]>(() => {
    if (!config || Object.keys(config).length === 0) return []
    return Object.entries(config).map(([key, value]) => ({
      key,
      value: String(value),
      type: typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string',
    }))
  })

  const updateItems = (newItems: ConfigItem[]) => {
    setItems(newItems)
    const newConfig: Record<string, any> = {}
    newItems.forEach((item) => {
      if (item.key) {
        if (item.type === 'number') {
          newConfig[item.key] = item.value ? Number(item.value) : 0
        } else if (item.type === 'boolean') {
          newConfig[item.key] = item.value === 'true'
        } else {
          newConfig[item.key] = item.value
        }
      }
    })
    onChange(newConfig)
  }

  const addItem = () => {
    updateItems([
      ...items,
      {
        key: '',
        value: '',
        type: 'string',
      },
    ])
  }

  const removeItem = (index: number) => {
    updateItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, updates: Partial<ConfigItem>) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], ...updates }
    updateItems(newItems)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Configuration</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add Config
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground border rounded-lg">
          No configuration items. Click "Add Config" to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`config-key-${index}`}>
                        Key <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`config-key-${index}`}
                        value={item.key}
                        onChange={(e) =>
                          updateItem(index, { key: e.target.value })
                        }
                        placeholder="configKey"
                        className="font-mono"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`config-type-${index}`}>
                        Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={item.type}
                        onValueChange={(value: any) =>
                          updateItem(index, { type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CONFIG_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`config-value-${index}`}>
                        Value <span className="text-red-500">*</span>
                      </Label>
                      {item.type === 'boolean' ? (
                        <Select
                          value={item.value}
                          onValueChange={(value) =>
                            updateItem(index, { value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">True</SelectItem>
                            <SelectItem value="false">False</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : item.type === 'color' ? (
                        <div className="flex gap-2">
                          <Input
                            id={`config-value-${index}`}
                            type="color"
                            value={item.value || '#000000'}
                            onChange={(e) =>
                              updateItem(index, { value: e.target.value })
                            }
                            className="w-20 h-10"
                          />
                          <Input
                            value={item.value || ''}
                            onChange={(e) =>
                              updateItem(index, { value: e.target.value })
                            }
                            placeholder="#000000"
                            className="font-mono"
                          />
                        </div>
                      ) : (
                        <Input
                          id={`config-value-${index}`}
                          type={item.type === 'number' ? 'number' : 'text'}
                          value={item.value}
                          onChange={(e) =>
                            updateItem(index, { value: e.target.value })
                          }
                          placeholder={
                            item.type === 'number' ? '0' : 'Enter value'
                          }
                        />
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="mt-8"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

