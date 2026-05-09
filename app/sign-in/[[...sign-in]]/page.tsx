import { SignIn } from "@clerk/nextjs";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { clerkAppearance } from "@/components/auth/clerk-appearance";

export default function SignInPage() {
  return (
    <AuthPageShell>
      <SignIn appearance={clerkAppearance} signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL} />
    </AuthPageShell>
  );
}
