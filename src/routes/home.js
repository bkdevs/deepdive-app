import Hero from "components/home/hero";
import Features from "components/home/features";
import FeaturesBlocks from "components/home/features-blocks";

const Home = () => {
  return (
    <>
      <main className="grow">
        <Hero />
        <Features />
        <FeaturesBlocks />
      </main>
    </>
  );
};

export default Home;
