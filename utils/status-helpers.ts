export function getConnectionStatusIcon() {
    // This will be called from the component with the actual status
    return null
  }
  
  export function getConnectionStatusText() {
    // This will be called from the component with the actual status
    return ""
  }
  
  export function getCategoryColor(category: string) {
    switch (category) {
      case "Diamond":
        return "bg-purple-600"
      case "Platinum":
        return "bg-gray-400"
      case "Gold":
        return "bg-yellow-500"
      case "Silver":
        return "bg-gray-300"
      default:
        return "bg-gray-500"
    }
  }
  