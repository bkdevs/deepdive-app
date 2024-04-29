import {
  AlertTwoTone,
  FileExcelTwoTone,
  ContainerTwoTone,
  DatabaseTwoTone,
  SnippetsTwoTone,
  SlidersTwoTone,
} from "@ant-design/icons";

const FeaturesBlocks = () => {
  return (
    <section className="relative">
      {/* Section background (needs .relative class on parent and next sibling elements) */}
      <div
        className="absolute inset-0 top-1/2 md:mt-24 lg:mt-0 pointer-events-none"
        aria-hidden="true"
      ></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-8 md:pb-8">
            <h2 className="h2 mb-4">Features</h2>
            <p className="text-xl text-gray-600">
              AI is only one part of DeepDive.
            </p>
          </div>

          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none">
            {/* 1st item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
              <SlidersTwoTone style={{ fontSize: "32px" }} />
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                Visual editing
              </h4>
              <p className="text-gray-600 text-center">
                Understand and correct queries through intuitive UIs. No SQL
                required
              </p>
            </div>

            {/* 2nd item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
              <AlertTwoTone style={{ fontSize: "32px" }} />
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                Learns as you go
              </h4>
              <p className="text-gray-600 text-center">
                The more you use DeepDive, the better it gets
              </p>
            </div>

            {/* 3rd item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
              <DatabaseTwoTone style={{ fontSize: "32px" }} />
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                SQL compatible
              </h4>
              <p className="text-gray-600 text-center">
                Any database that can support SQL, can support DeepDive
              </p>
            </div>

            {/* 4th item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
              <SnippetsTwoTone style={{ fontSize: "32px" }} />
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                Multiple files
              </h4>
              <p className="text-gray-600 text-center">
                Analyze across multiple datasets at once, and create
                consolidated reports
              </p>
            </div>

            {/* 5th item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
              <ContainerTwoTone style={{ fontSize: "32px" }} />
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                One-click report
              </h4>
              <p className="text-gray-600 text-center">
                Generate a curated report for your data with just one-click
              </p>
            </div>

            {/* 6th item */}
            <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
              <FileExcelTwoTone style={{ fontSize: "32px" }} />
              <h4 className="text-xl font-bold leading-snug tracking-tight mb-1">
                Export and share
              </h4>
              <p className="text-gray-600 text-center">
                Export to Excel and share reports with stakeholders seamlessly
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesBlocks;
