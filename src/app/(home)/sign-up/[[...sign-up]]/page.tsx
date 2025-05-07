import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-black/20 border border-purple-500/20",
            headerTitle: "text-gray-200",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton:
              "bg-black/20 border border-purple-500/20 text-gray-200 hover:bg-purple-500/10",
            formButtonPrimary:
              "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
            footerActionLink: "text-purple-400 hover:text-purple-300",
            formFieldInput: "bg-black/20 border-purple-500/20 text-gray-200",
            formFieldLabel: "text-gray-200",
          },
        }}
      />
    </div>
  );
}
