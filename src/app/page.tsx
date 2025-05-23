import { redirect } from 'next/navigation';

// The default locale can be hardcoded or read from a shared config
const defaultLocale = 'es';

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
