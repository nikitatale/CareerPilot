"use client"

import { usePathname } from "next/navigation"
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";

export default function UserLayout({ children }) {
  const pathname = usePathname();  

  return (
    <div style={{ background: "#080612", minHeight: "100vh" }}>
      <Navbar/>

      <div style={{ paddingTop: "68px", background: "#080612" }}>
        {children}
      </div>

    
      {pathname === "/" && <Footer />}
    </div>
  );
}