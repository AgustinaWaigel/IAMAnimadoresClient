export function adaptCloudinaryUrl(url: string | undefined | null): string {
    if (!url) return "";
  
    if (url.includes("/upload/") && !url.includes("/fl_inline/")) {
      // Insertar fl_inline después de upload/
      return url.replace("/upload/", "/upload/fl_inline/");
    }
  
    return url;
  }
  