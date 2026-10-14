import { redirect } from "next/navigation";

// The login page forwards already-logged-in users to their home page.
export default function Home() {
  redirect("/login");
}
