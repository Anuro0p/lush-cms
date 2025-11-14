/**
 * Helper function to get height styles from section config
 */
export function getSectionHeightStyles(config?: any): React.CSSProperties {
  const styles: React.CSSProperties = {}
  
  if (config?.height) {
    styles.height = `${config.height}px`
  }
  
  if (config?.minHeight) {
    styles.minHeight = `${config.minHeight}px`
  }
  
  if (config?.maxHeight) {
    styles.maxHeight = `${config.maxHeight}px`
  }
  
  return styles
}

