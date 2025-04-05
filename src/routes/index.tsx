import { createFileRoute } from "@tanstack/react-router";
import "../App.css";
import Header from "@/components/Header";
import { SignedIn } from "@clerk/clerk-react";
import Notes from "@/components/notes";
import ClerkSignedInComponent from "@/components/ClerkSignedInComponent";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
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

export default App;
