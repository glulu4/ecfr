import TitleList from "@/components/TitleList";
import {fetchAgencies} from "@/lib/agency/fetch-agencies";


export default async function Home() {

  const agencies = await fetchAgencies();
  // console.log("Agencies: ", agencies);
  
  return (
    <div className="overflow-y-scroll items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 ">

      <TitleList />
    </div>
  );
}
