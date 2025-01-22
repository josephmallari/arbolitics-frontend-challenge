"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import "tailwindcss/tailwind.css";
import DataVisualization from "../../components/DataVisualization";
import { Interval } from "../types"; // Import type

const fetchDataset = async ({ queryKey }: { queryKey: [string, string | null, number, number] }) => {
  const [, accessToken, location_id, limit] = queryKey;
  const response = await axios.get("/api/fetchData", {
    params: {
      accessToken,
      location_id,
      limit,
    },
  });

  return response.data.data; // Adjusted to return the data array
};

const DataPage: React.FC = () => {
  const searchParams = useSearchParams();
  const accessToken = searchParams ? searchParams.get("userData") : null;

  const [interval, setInterval] = useState<Interval>("daily");
  const [limit, setLimit] = useState(24);

  useEffect(() => {
    const intervalLimits = {
      daily: 24,
      weekly: 168,
      monthly: 672,
    };
    setLimit(intervalLimits[interval]);
  }, [interval]);

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
