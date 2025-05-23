// This is the new root layout, it's minimal.
// The actual HTML structure will be in [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
