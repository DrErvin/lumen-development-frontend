import { Rubik } from "next/font/google";
import "./styles/main.css"; // Import your main.css here

const rubik = Rubik({
  // weight: ["400", "700"], // Specify weights you need
  subsets: ["latin"],
  variable: "--font-rubik",
});

export const metadata = {
  title: "Telekom Opportunity Platform",
  description:
    "Connect with student opportunities at Deutsche Telekom",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={rubik.variable}>{children}</body>
    </html>
  );
}
