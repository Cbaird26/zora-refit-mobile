import { Directory, Encoding, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { isNativePlatform } from "./runtime";
import type { NativeExportArtifact } from "./types";

export function buildJsonExportArtifact(fileName: string, contents: string): NativeExportArtifact {
  return {
    fileName,
    mimeType: "application/json",
    contents,
  };
}

export async function exportJsonArtifact(artifact: NativeExportArtifact) {
  if (isNativePlatform()) {
    const path = `exports/${artifact.fileName}`;
    await Filesystem.writeFile({
      path,
      data: artifact.contents,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
      recursive: true,
    });

    const { uri } = await Filesystem.getUri({
      path,
      directory: Directory.Cache,
    });

    await Share.share({
      title: artifact.fileName,
      text: "Zora Refit export",
      url: uri,
      dialogTitle: "Share Zora Refit export",
    });

    return uri;
  }

  const blob = new Blob([artifact.contents], { type: artifact.mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = artifact.fileName;
  link.click();
  URL.revokeObjectURL(url);
  return artifact.fileName;
}
