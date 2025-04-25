import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "./components/navbar";
import LanguageSelector from "./components/language-selector";
import ReduxProvider from "./redux-provider";
import AuthProvider from "./components/AuthProvider";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

const inter = Inter({ subsets: ["latin"] });
interface Props {
  children: React.ReactNode;
  params: { locale: string };
}
export const metadata: Metadata = {
  title: "APLV Air In Pipes",
  description: "Design, manage, and collaborate on gravity flow water systems.",
};

export default async function LocalLayout({
  children,
  params: { locale },
}: Props) {
  let messages;
  try {
    messages = (await import(`@/../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
  return (
    <html lang={locale} className="h-screen bg-white">
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReduxProvider>
              <AuthProvider>
                <div>
                  <NavBar locale={locale} />
                  <div className="flex justify-end">
                    <LanguageSelector />
                  </div>
                  {children}
                </div>
              </AuthProvider>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
