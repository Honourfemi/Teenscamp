import './globals.css';

export const metadata = {
  title: 'Teens Camp 4th Edition | Kingdom Connection Ministries Abuja',
  description: 'Register for Teens Camp 4th Edition - Theme: The Obedience',
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
