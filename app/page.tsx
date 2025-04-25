import TitleList from "@/components/TitleList";

export default async function Home() {

  return (
    <div className="overflow-y-scroll items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">
      <div className="text-center py-8">
        <h1 className="text-5xl font-semibold mb-1">
          eCFR Analyzer
        </h1>
        <p className="text-gray-600 mb-4">
          Analyze word counts in the eCFR by agency and title.
        </p>
      </div>
      <TitleList />
    </div>
  );
}
