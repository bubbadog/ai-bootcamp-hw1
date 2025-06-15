export const metadata = {
  title: "AI Poem Generator",
  description: "Generate beautiful poems about coding and AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}