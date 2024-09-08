import $fetch from "@/utils/api";

export const imageUploader = async ({
  file,
  dir,
  size = {
    maxWidth: 64,
    maxHeight: 64,
  },
  oldPath = "",
}: {
  file: File;
  dir: string;
  size: {
    width?: number;
    height?: number;
    maxWidth: number;
    maxHeight: number;
  };
  oldPath?: string;
}) => {
  // Convert the file to base64
  const fileToBase64 = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string); // Type assert to string
      reader.onerror = () => reject("Error reading file");
      reader.readAsDataURL(file);
    });
  };
  const base64File = await fileToBase64(file);
  // Use JavaScript Image object to get intrinsic dimensions
  const img = new Image();
  img.src = base64File;
  await new Promise((resolve) => (img.onload = resolve));

  const { width, height, maxWidth, maxHeight } = size;

  const filePayload = {
    file: base64File,
    dir,
    width:
      Number(width || img.naturalWidth) > maxWidth
        ? maxWidth
        : Number(width || img.naturalWidth),
    height:
      Number(height || img.naturalHeight) > maxHeight
        ? maxHeight
        : Number(height || img.naturalHeight),
    oldPath,
  };
  try {
    const { data, error } = await $fetch({
      url: "/api/upload",
      method: "POST",
      body: filePayload,
    });
    if (error) {
      throw new Error("File upload failed");
    }
    return {
      success: true,
      url: data.url,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return { success: false };
  }
};
