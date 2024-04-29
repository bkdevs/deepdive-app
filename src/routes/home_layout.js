import "aos/dist/aos.css";
import "index.css";

import Aos from "aos";
import Header from "components/home/header";
import Footer from "components/home/footer";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  useEffect(() => {
    Aos.init({
      once: true,
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
    });
  });

  return (
    <div className="flex flex-col min-h-screen overflow-hidden supports-[overflow:clip]:overflow-clip">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default HomeLayout;
