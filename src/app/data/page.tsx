"use client";

import React from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const fetchDataset = async ({ queryKey }) => {
  const [, accessToken, location_id, limit] = queryKey;
  const response = await axios.get("/api/fetchData", {
    params: {
      accessToken,
      location_id,
      limit,
    },
  });
  return response.data;
};

const data = () => {
  const searchParams = useSearchParams();
  const accessToken = searchParams ? searchParams.get("userData") : null;

  const parsedData = accessToken ? JSON.parse(accessToken) : null;
  const {
    data: fetchedData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["dataset", parsedData, 10, 672], // Replace 10 and 1 with actual location_id and limit if needed
    queryFn: fetchDataset,
    enabled: !!parsedData, // Only run the query if parsedData is available
  });

  const [dataset] = useState(fetchedData);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching dataset: {error.message}</p>;

  return (
    <div>
      <h1>Data Component</h1>
      {/* {dataset ? <pre>{JSON.stringify(dataset, null, 2)}</pre> : <p>No data available</p>} */}
    </div>
  );
};

export default data;
