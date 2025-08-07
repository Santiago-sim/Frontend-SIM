/**
 * Utility function to download a file from a URL
 * @param url URL of the file to download
 * @param filename Name to save the file as
 */
export async function downloadFile(url: string, filename: string): Promise<void> {
    try {
      // Fetch the file
      const response = await fetch(url)
      const blob = await response.blob()
  
      // Create a temporary URL for the blob
      const blobUrl = URL.createObjectURL(blob)
  
      // Create a temporary link element
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = filename
  
      // Append to the document, click it, and remove it
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
  
      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error("Error downloading file:", error)
      throw error
    }
  }
  