import { ColorPaletteItem } from "../types";

export function groupColorsByCategory(colors: ColorPaletteItem[]): Map<string, ColorPaletteItem[]> {
  const grouped = new Map<string, ColorPaletteItem[]>();

  colors.forEach((color) => {
    const category = color.name.includes("/") ? color.name.split("/")[0] : "Unsorted";

    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)?.push(color);
  });

  return grouped;
}
