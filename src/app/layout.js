import { Roboto } from "next/font/google";
import "./globals.css";
import { UserProvider } from '../contexts/UserContext.jsx';

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata = {
  title: "Cinema Scope - Discover Movies & TV Shows",
  description: "Discover trending movies and TV shows, search your favorites, and build your personal watchlist with Cinema Scope.",
  keywords: "movies, tv shows, cinema, entertainment, tmdb, watchlist, favorites",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} font-sans antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}
      >
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
