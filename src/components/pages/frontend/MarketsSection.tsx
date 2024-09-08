import TrendingMarkets from "../user/markets/TrendingMarkets";

const MarketsSection = () => {
  return (
    <section className="w-full px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto dark:bg-black bg-white dark:bg-dot-white/[0.1] bg-dot-black/[0.1] relative">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_70%,black)]"></div>

      <div className="max-w-7xl relative pt-6 lg:pt-0 px-0 mx-auto">
        <TrendingMarkets />
      </div>
    </section>
  );
};

export default MarketsSection;
