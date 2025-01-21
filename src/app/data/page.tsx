"use client";

import { useSearchParams } from "next/navigation";

const data = () => {
  const searchParams = useSearchParams();
  const userData = searchParams ? searchParams.get("userData") : null;

  const parsedData = userData ? JSON.parse(userData) : null;
  console.log(parsedData);

  return (
    <div>
      <h1>Data Component</h1>
      {/* {parsedData && <pre>{JSON.stringify(parsedData, null, 2)}</pre>} */}
    </div>
  );
};

export default data;
