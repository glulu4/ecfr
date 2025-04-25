import {getWordCountByAgency} from '@/lib/agency/wordCountPerAgency';
import {fetchAllEcfrTitles} from '@/lib/fetchTitles';
import React from 'react';
import {ChevronLeft} from 'lucide-react';
import {getVersionsByDate} from '@/lib/getVersions';
import {WordCountChart} from '@/components/WordCountChart';
import {WordCountVersionViewer} from '@/components/WordCountVersionViewer';



export default async function Page({params}: {params: Promise<{titleNum: string}>}) {
  const {titleNum} = await params;

  const titles = await fetchAllEcfrTitles();
  const titleObj = titles.find((t) => String(t.number) === titleNum);

  if (!titleObj) {
    return <div className="p-8 text-red-600">Title not found.</div>;
  }

  const wordCount = await getWordCountByAgency(titleObj.number, titleObj.latest_amended_on);
  const versionDates: string[] = await getVersionsByDate(titleNum);

  const data = Object.entries(wordCount).map(([agency, count]) => ({
    agency,
    count,
  }));

  return (
    <div className="px-4 md:px-12 mx-auto max-w-7xl">

      <a
        href="/"
        className="absolute top-6 left-4 flex items-center gap-2 p-4 text-sm text-blue-600 hover:text-blue-800 transition"
        aria-label="Go back"
      >
        <ChevronLeft size={18} />
        <span>Back</span>
      </a>

      <div className="flex flex-col items-center justify-around py-12 md:py-28">

        <div className="flex flex-col md:flex-row items-center justify-around w-full gap-12">

          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-semibold mb-2">
              Title {titleObj.number}
            </h1>
            <p className="text-gray-600 mb-4">{titleObj.name}</p>
            <a
              className="text-blue-600 underline mb-6 inline-block"
              href={`https://www.ecfr.gov/current/title-${titleNum}`}
              target="_blank"
            >
              View full text on eCFR.gov
            </a>
          </div>

          <div className="w-full md:w-1/2">
            <WordCountChart
              data={data}
              titleNum={titleNum}
              amendedOn={titleObj.latest_amended_on}
            />
          </div>

        </div>

        <div className="flex flex-col items-center justify-center w-full pt-16 md:pt-40">

          <h3 className="text-2xl font-semibold mb-6 text-center">
            Compare Word Counts by Agency Over Time
          </h3>

          <div className="w-full">
            <WordCountVersionViewer
              titleNum={titleObj.number}
              availableDates={versionDates}
            />
          </div>

        </div>

      </div>

    </div>
  );
}
