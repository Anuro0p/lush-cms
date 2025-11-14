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
import { Plus, Trash2, GripVertical } from 'lucide-react'

export interface FieldDefinition {
  name: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'image' | 'url' | 'color'
  required?: boolean
  defaultValue?: string
  placeholder?: string
  options?: string[] // For select type
  description?: string
}

interface FieldBuilderProps {
  fields: FieldDefinition[]
  onChange: (fields: FieldDefinition[]) => void
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'select', label: 'Select Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'image', label: 'Image URL' },
  { value: 'url', label: 'URL' },
  { value: 'color', label: 'Color Picker' },
]

export function FieldBuilder({ fields, onChange }: FieldBuilderProps) {
  const addField = () => {
    onChange([
      ...fields,
      {
        name: '',
        label: '',
        type: 'text',
        required: false,
      },
    ])
  }

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index))
  }

  const updateField = (index: number, updates: Partial<FieldDefinition>) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], ...updates }
    onChange(newFields)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Fields</Label>
        <Button type="button" variant="outline" size="sm" onClick={addField}>
          <Plus className="mr-2 h-4 w-4" />
          Add Field
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground border rounded-lg">
          No fields defined. Click "Add Field" to create one.
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`field-name-${index}`}>
                            Field Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`field-name-${index}`}
                            value={field.name}
                            onChange={(e) =>
                              updateField(index, { name: e.target.value })
                            }
                            placeholder="fieldName"
                            className="font-mono"
                          />
                          <p className="text-xs text-muted-foreground">
                            Used in code (camelCase)
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`field-label-${index}`}>
                            Label <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`field-label-${index}`}
                            value={field.label}
                            onChange={(e) =>
                              updateField(index, { label: e.target.value })
                            }
                            placeholder="Field Label"
                          />
                          <p className="text-xs text-muted-foreground">
                            Display name
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`field-type-${index}`}>
                            Type <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={field.type}
                            onValueChange={(value: any) =>
                              updateField(index, {
                                type: value,
                                options: value === 'select' ? [''] : undefined,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {FIELD_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`field-required-${index}`}>
                            Required
                          </Label>
                          <Select
                            value={field.required ? 'true' : 'false'}
                            onValueChange={(value) =>
                              updateField(index, { required: value === 'true' })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="true">Yes</SelectItem>
                              <SelectItem value="false">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {field.type === 'select' && (
                        <div className="space-y-2">
                          <Label htmlFor={`field-options-${index}`}>
                            Options (one per line)
                          </Label>
                          <textarea
                            id={`field-options-${index}`}
                            value={field.options?.join('\n') || ''}
                            onChange={(e) =>
                              updateField(index, {
                                options: e.target.value
                                  .split('\n')
                                  .filter((o) => o.trim()),
                              })
                            }
                            placeholder="Option 1&#10;Option 2&#10;Option 3"
                            rows={4}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`field-placeholder-${index}`}>
                            Placeholder
                          </Label>
                          <Input
                            id={`field-placeholder-${index}`}
                            value={field.placeholder || ''}
                            onChange={(e) =>
                              updateField(index, { placeholder: e.target.value })
                            }
                            placeholder="Enter placeholder text"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`field-default-${index}`}>
                            Default Value
                          </Label>
                          <Input
                            id={`field-default-${index}`}
                            value={field.defaultValue || ''}
                            onChange={(e) =>
                              updateField(index, { defaultValue: e.target.value })
                            }
                            placeholder="Default value"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`field-description-${index}`}>
                          Description
                        </Label>
                        <Input
                          id={`field-description-${index}`}
                          value={field.description || ''}
                          onChange={(e) =>
                            updateField(index, { description: e.target.value })
                          }
                          placeholder="Help text for this field"
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(index)}
                      className="mt-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

