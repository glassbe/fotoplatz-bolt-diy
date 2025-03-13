/**
 * Converts a data URL to a Blob object
 */
export const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
};

/**
 * Downloads a data URL as a file
 */
export const downloadImage = (dataURL: string, fileName: string): void => {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = `${fileName}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Resizes an image to the specified dimensions
 */
export const resizeImage = (
  dataURL: string, 
  maxWidth: number, 
  maxHeight: number
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = dataURL;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round(height * (maxWidth / width));
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round(width * (maxHeight / height));
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      ctx!.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/jpeg'));
    };
  });
};
