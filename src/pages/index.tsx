// src/pages/index.jsx
import React, { useState } from "react";
import HeroSection from "@/components/pages/frontend/HeroSection";
import FeaturesSection from "@/components/pages/frontend/FeaturesSection";
import Footer from "@/components/pages/frontend/Footer";
import Layout from "@/layouts/Nav";
import BuilderComponent from "@/components/pages/frontend/BuilderComponent";
import StatusSection from "@/components/pages/frontend/StatusSection";
import CookieBanner from "@/components/pages/frontend/Cookie";
import BannerSection from "@/components/pages/frontend/BannerSection";
import TrendingMarkets from "@/components/pages/user/markets/TrendingMarkets";
import MarketsSection from "@/components/pages/frontend/MarketsSection";

const frontendType = process.env.NEXT_PUBLIC_FRONTEND_TYPE || "default";

const Home = () => {
  if (frontendType === "default") {
    return (
      <Layout horizontal>
        <HeroSection />
        <MarketsSection />
        <StatusSection />
        <FeaturesSection />
        <BannerSection />
        <Footer />
        <CookieBanner />
      </Layout>
    );
  }

  return <BuilderComponent />;
};

export default Home;
