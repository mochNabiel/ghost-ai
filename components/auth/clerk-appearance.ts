import { dark } from "@clerk/ui/themes";

export const clerkAppearance = {
  theme: dark,
  variables: {
    colorPrimary: "var(--accent-primary)",
    colorPrimaryForeground: "var(--bg-base)",
    colorDanger: "var(--state-error)",
    colorSuccess: "var(--state-success)",
    colorWarning: "var(--state-warning)",
    colorForeground: "var(--text-primary)",
    colorMuted: "var(--bg-subtle)",
    colorMutedForeground: "var(--text-muted)",
    colorBackground: "var(--bg-surface)",
    colorInput: "var(--bg-elevated)",
    colorInputForeground: "var(--text-primary)",
    colorRing: "var(--accent-primary)",
    colorBorder: "var(--border-default)",
    colorModalBackdrop: "color-mix(in srgb, var(--bg-base) 72%, transparent)",
    fontFamily: "var(--font-geist-sans)",
    fontFamilyButtons: "var(--font-geist-sans)",
    borderRadius: "var(--radius)",
  },
  elements: {
    card: {
      backgroundColor: "var(--bg-surface)",
      borderColor: "var(--border-default)",
      boxShadow: "none",
    },
    formButtonPrimary: {
      color: "var(--bg-base)",
      backgroundColor: "var(--accent-primary)",
      boxShadow: "none",
      "&:hover": {
        backgroundColor: "var(--accent-primary)",
      },
    },
    footerActionLink: {
      color: "var(--accent-primary)",
    },
  },
};
