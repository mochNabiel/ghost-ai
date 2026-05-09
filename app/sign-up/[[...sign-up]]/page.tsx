import { SignUp } from "@clerk/nextjs";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { clerkAppearance } from "@/components/auth/clerk-appearance";

export default function SignUpPage() {
  return (
    <AuthPageShell>
      <SignUp appearance={clerkAppearance} signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL} />
    </AuthPageShell>
  );
}
