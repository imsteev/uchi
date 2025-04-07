import { SignedIn, UserButton } from "@clerk/clerk-react";

export default function Header() {
  return (
    <header>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
