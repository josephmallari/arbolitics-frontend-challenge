"use client";

import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import ReactECharts from "echarts-for-react";
import "tailwindcss/tailwind.css";

const fetchDataset = async ({ queryKey }) => {
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

const processData = (data, interval) => {
  if (!Array.isArray(data)) {
    console.error("Data is not an array:", data);
    return [];
  }

  const intervals = {
    daily: 24,
    weekly: 24 * 7,
    monthly: 24 * 7 * 4,
  };

  const intervalSize = intervals[interval];
  return data.slice(0, intervalSize);
};

const DataVisualization = ({ data }) => {
  const [interval, setInterval] = useState("daily");

  const handleIntervalChange = (e) => {
    setInterval(e.target.value);
  };

  const filteredData = processData(data, interval);

  const option = {
    title: {
      text: "Temperature and Humidity",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Temperature", "Humidity"],
    },
    xAxis: {
      type: "category",
      data: filteredData.map((item) => new Date(item.TMS * 1000).toLocaleString()),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Temperature",
        type: "line",
        data: filteredData.map((item) => item.tem1),
      },
      {
        name: "Humidity",
        type: "line",
        data: filteredData.map((item) => item.hum1),
      },
    ],
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="interval" className="mr-2">
          Select Interval:
        </label>
        <select id="interval" value={interval} onChange={handleIntervalChange} className="p-2 border rounded">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />
    </div>
  );
};

const DataPage = () => {
  const searchParams = useSearchParams();
  const accessToken = searchParams ? searchParams.get("userData") : null;

  const parsedData = accessToken ? JSON.parse(accessToken) : null;
  const {
    data: dataset,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["dataset", parsedData, 10, 672], // Replace 10 and 1 with actual location_id and limit if needed
    queryFn: fetchDataset,
    enabled: !!parsedData, // Only run the query if parsedData is available
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching dataset: {error.message}</p>;

  return <DataVisualization data={dataset} />;
};

export default DataPage;
