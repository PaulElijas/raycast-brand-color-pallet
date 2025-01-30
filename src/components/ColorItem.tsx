import { Grid, ActionPanel, Action, Icon, getFrontmostApplication } from "@raycast/api";
import { deleteColor } from "../utils/storage";
import { ColorForm } from "./ColorForm";
import { useState, useEffect } from "react";
import path from "path";
import fs from "fs";
import { ColorItemProps, FrontMostApp } from "../types";

export function ColorItem({ color, onUpdate, tokenMode }: ColorItemProps) {
  const [frontMostApp, setFrontMostApp] = useState<FrontMostApp>({
    name: "",
    iconPath: "",
  });

  const colorValue = color.type === "primitive" ? color.value : color.values[tokenMode];

  useEffect(() => {
    async function getFrontmostApp() {
      const frontMostApp = await getFrontmostApplication();

      let iconPath = "";
      if (frontMostApp?.path) {
        const resourcesPath = path.join(frontMostApp.path, "Contents", "Resources");

        try {
          const files = fs.readdirSync(resourcesPath);
          const icnsFile = files.find((file) => file.endsWith(".icns"));
          if (icnsFile) {
            iconPath = path.join(resourcesPath, icnsFile);
          }
        } catch (error) {
          console.error("Error finding icon:", error);
        }
      }

      const frontMostAppInfo: FrontMostApp = {
        name: frontMostApp?.name ?? "",
        iconPath: iconPath,
      };

      setFrontMostApp(frontMostAppInfo);
    }
    getFrontmostApp();
  }, []);

  async function handleDelete() {
    await deleteColor(color.id);
    onUpdate();
  }

  return (
    <Grid.Item
      content={{
        color: {
          light: colorValue,
          dark: colorValue,
          adjustContrast: false,
        },
      }}
      title={color.name.includes("/") ? color.name.split("/")[1] : color.name}
      subtitle={colorValue}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <Action.CopyToClipboard title="Copy Color Value" content={colorValue} />
            <Action.Paste
              title={`Paste in ${frontMostApp.name}`}
              content={colorValue}
              icon={frontMostApp.iconPath || Icon.AppWindow}
            />
            <Action.Push
              icon={Icon.Pencil}
              title="Edit Color"
              target={<ColorForm color={color} onSave={onUpdate} />}
              shortcut={{ modifiers: ["cmd"], key: "e" }}
            />
          </ActionPanel.Section>
          <ActionPanel.Section>
            <Action.Push
              icon={Icon.Plus}
              title="Add Color"
              target={<ColorForm onSave={onUpdate} />}
              shortcut={{ modifiers: ["cmd"], key: "n" }}
            />
            <Action icon={Icon.Trash} title="Delete Color" style={Action.Style.Destructive} onAction={handleDelete} />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
