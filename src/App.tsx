import { SignedIn } from "@clerk/clerk-react";
import ClerkSignedInComponent from "./components/ClerkSignedInComponent";
import Header from "./components/Header";
import Notes from "./components/notes";

export default function App() {
  return (
    <div className="App">
      <Header />
      <SignedIn>
        <ClerkSignedInComponent />
        <Notes />
      </SignedIn>
    </div>
  );
}
