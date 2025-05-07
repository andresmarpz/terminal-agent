import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

interface ColorBoxProps {
  name: string;
  colorValue: string;
  className?: string;
}

function ColorBox({ name, colorValue, className }: ColorBoxProps) {
  const textColor = name.endsWith("-foreground")
    ? "text-[var(--background)]" // Heuristic for better contrast on foreground colors
    : "text-[var(--foreground)]";
  // For oklch values like 'oklch(0 0 0)' or 'oklch(0.961 0.015 105.01 / 0.8)'
  // We want to apply them directly to the style
  const style = { backgroundColor: colorValue };

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`h-20 w-full rounded-md border border-border flex items-center justify-center ${className}`}
        style={style}
      >
        <span className={`text-xs font-medium ${textColor}`}>{name}</span>
      </div>
      <p className="text-xs text-muted-foreground">{colorValue}</p>
    </div>
  );
}

const terminalColors = {
  background: "oklch(0 0 0)",
  foreground: "oklch(0.961 0.015 105.01)",
  card: "oklch(0.05 0 0)",
  "card-foreground": "oklch(0.961 0.015 105.01)",
  popover: "oklch(0.05 0 0)",
  "popover-foreground": "oklch(0.961 0.015 105.01)",
  primary: "oklch(0.68 0.22 47.604)",
  "primary-foreground": "oklch(0.24 0.07 48.84)",
  secondary: "oklch(0.205 0 0)",
  "secondary-foreground": "oklch(0.961 0.015 105.01)",
  muted: "oklch(0.371 0 0)",
  "muted-foreground": "oklch(0.961 0.015 105.01 / 0.8)",
  accent: "oklch(0.68 0.19 47.604 / 0.5)",
  "accent-foreground": "oklch(0.961 0.015 105.01)",
  destructive: "oklch(0.404 0.151 22.216)",
  "destructive-foreground": "oklch(0.85 0.151 22)",
  border: "oklch(1 0 0 / 15%)",
  input: "oklch(1 0 0 / 15%)",
  ring: "oklch(0.805 0.19 47.604 / 0.6)",
  // Note: Chart colors are included here as they are part of the .terminal theme in globals.css
  // Even if not directly used by other palettes in this file, they are part of the theme.
  "chart-1": "oklch(0.488 0.243 264.376)",
  "chart-2": "oklch(0.696 0.17 162.48)",
  "chart-3": "oklch(0.769 0.188 70.08)",
  "chart-4": "oklch(0.627 0.265 303.9)",
  "chart-5": "oklch(0.645 0.246 16.439)",
  sidebar: "oklch(0.05 0 0)",
  "sidebar-foreground": "oklch(0.961 0.015 105.01)",
  "sidebar-primary": "oklch(0.68 0.19 47.604)",
  "sidebar-primary-foreground": "oklch(0 0 0)",
  "sidebar-accent": "oklch(0.68 0.19 47.604 / 0.3)",
  "sidebar-accent-foreground": "oklch(0.961 0.015 105.01)",
  "sidebar-border": "oklch(0.68 0.19 47.604 / 0.2)",
  "sidebar-ring": "oklch(0.68 0.19 47.604 / 0.5)",
};

const orangePalette = {
  primary: terminalColors.primary,
  accent: terminalColors.accent,
  ring: terminalColors.ring,
  "sidebar-primary": terminalColors["sidebar-primary"],
  "sidebar-accent": terminalColors["sidebar-accent"],
  "sidebar-border": terminalColors["sidebar-border"],
  "sidebar-ring": terminalColors["sidebar-ring"],
};

const grayBlackPalette = {
  background: terminalColors.background,
  card: terminalColors.card,
  popover: terminalColors.popover,
  "primary-foreground": terminalColors["primary-foreground"],
  secondary: terminalColors.secondary,
  muted: terminalColors.muted,
  input: terminalColors.input,
};

const whiteBeigePalette = {
  foreground: terminalColors.foreground,
  "card-foreground": terminalColors["card-foreground"],
  "popover-foreground": terminalColors["popover-foreground"],
  "secondary-foreground": terminalColors["secondary-foreground"],
  "muted-foreground": terminalColors["muted-foreground"],
  "accent-foreground": terminalColors["accent-foreground"],
  border: terminalColors.border, // This is technically white with opacity
};

export default function DesignPage() {
  return (
    <div className="container mx-auto flex flex-col gap-8 py-8">
      <h1 className="text-3xl font-bold">Terminal Design System</h1>

      {/* Button Component */}
      <Card>
        <CardHeader>
          <CardTitle>Button</CardTitle>
          <CardDescription>
            Displays a button or a component that looks like a button.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button disabled>Disabled</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            {/* Placeholder for an icon, e.g., <ChevronRightIcon className="h-4 w-4" /> */}
            <span>Icon</span>
          </Button>
        </CardContent>
        <CardFooter>
          <p>Various button styles and states.</p>
        </CardFooter>
      </Card>

      {/* Textarea Component */}
      <Card>
        <CardHeader>
          <CardTitle>Textarea</CardTitle>
          <CardDescription>
            Displays a form textarea or a component that looks like a textarea.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea placeholder="Type your message here." />
        </CardContent>
        <CardFooter>
          <p>A simple textarea component.</p>
        </CardFooter>
      </Card>

      {/* DropdownMenu Component */}
      <Card>
        <CardHeader>
          <CardTitle>Dropdown Menu</CardTitle>
          <CardDescription>
            Displays a menu to the user — such as a set of actions or functions
            — triggered by a button.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Open Menu</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
        <CardFooter>
          <p>An example of a dropdown menu.</p>
        </CardFooter>
      </Card>

      {/* Card Component (meta, I know) */}
      <Card>
        <CardHeader>
          <CardTitle>Card</CardTitle>
          <CardDescription>
            Displays a card with header, content, and footer sections.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the content area of the card.</p>
        </CardContent>
        <CardFooter>
          <p>This is the footer of the card.</p>
        </CardFooter>
      </Card>

      {/* Color Palette Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Terminal Color Palette</CardTitle>
          <CardDescription>
            A showcase of the Terminal theme&apos;s color palette.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="mb-2 text-lg font-semibold">Main Palette</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {Object.entries(terminalColors)
                // Filter out sidebar specific colors for the main display for brevity
                // as they are often variants of primary/accent.
                .filter(([name]) => !name.startsWith("sidebar-"))
                .map(([name, colorValue]) => (
                  <ColorBox
                    key={name}
                    name={`--${name}`}
                    colorValue={colorValue}
                  />
                ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Orange Shades</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
              {Object.entries(orangePalette).map(([name, colorValue]) => (
                <ColorBox
                  key={name}
                  name={`--${name}`}
                  colorValue={colorValue}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">Gray & Black Shades</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
              {Object.entries(grayBlackPalette).map(([name, colorValue]) => (
                <ColorBox
                  key={name}
                  name={`--${name}`}
                  colorValue={colorValue}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold">White & Beige Shades</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
              {Object.entries(whiteBeigePalette).map(([name, colorValue]) => (
                <ColorBox
                  key={name}
                  name={`--${name}`}
                  colorValue={colorValue}
                />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p>
            Colors defined in <code>globals.css</code> under the{" "}
            <code>.terminal</code> theme.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
