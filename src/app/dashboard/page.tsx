"use client";

import axios from "axios";
import "tailwindcss/tailwind.css";
import { Interval } from "../types";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import DataVisualization from "../../components/DataVisualization";

// Fetch data from the API
const fetchDataset = async ({ queryKey }: { queryKey: [string, string | null, number, number] }) => {
  const [, accessToken, location_id, limit] = queryKey;
  const response = await axios.get("/api/fetchData", {
    params: {
      accessToken,
      location_id,
      limit,
    },
  });

  return response.data.data;
};

const calculateLimit = (interval: Interval): number => {
  const intervalLimits = {
    daily: 24,
    weekly: 168,
    monthly: 672,
  };
  return intervalLimits[interval];
};

const DataPage: React.FC = () => {
  const searchParams = useSearchParams();
  const accessToken = searchParams ? searchParams.get("userData") : null;

  const [interval, setInterval] = useState<Interval>("daily");
  const limit = calculateLimit(interval);

  const parsedData = accessToken ? JSON.parse(accessToken) : null;
  const {
    data: dataset,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["dataset", parsedData, 10, limit], // Replace 10 with actual location_id if needed
    queryFn: fetchDataset,
    enabled: !!parsedData, // Only run the query if parsedData is available
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching dataset: {error.message}</p>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="interval" className="mr-2">
          Select Interval:
        </label>
        <select
          id="interval"
          value={interval}
          onChange={(e) => setInterval(e.target.value as Interval)}
          className="p-2 border rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <DataVisualization data={dataset} interval={interval} />
    </div>
  );
};

export default DataPage;
