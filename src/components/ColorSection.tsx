import { Grid } from "@raycast/api";
import { ColorSectionProps } from "../types";
import { ColorItem } from "./ColorItem";

export function ColorSection({ title, colors, tokenMode, onUpdate }: ColorSectionProps) {
  return (
    <Grid.Section title={title} subtitle={`${colors.length} colors`} columns={8}>
      {colors.map((color) => (
        <ColorItem key={color.name} color={color} onUpdate={onUpdate} tokenMode={tokenMode} />
      ))}
    </Grid.Section>
  );
}
