"use client";

import React, { useState, useEffect } from "react";
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
    daily: 24 * 2,
    weekly: 24 * 7 * 2,
    monthly: 24 * 7 * 4 * 2,
  };

  const intervalSize = intervals[interval];

  return data.slice(0, intervalSize);
};

const DataVisualization = ({ data, interval }) => {
  const filteredData = processData(data, interval);

  const device1Data = filteredData.filter((item) => item.DID === "25_225");
  const device2Data = filteredData.filter((item) => item.DID === "25_226");

  const option = {
    title: {
      text: "Temperature and Humidity",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Temperature 25_225", "Humidity 25_225", "Temperature 25_226", "Humidity 25_226"],
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
        name: "Temperature 25_225",
        type: "line",
        data: device1Data.map((item) => item.tem1),
      },
      {
        name: "Humidity 25_225",
        type: "line",
        data: device1Data.map((item) => item.hum1),
      },
      {
        name: "Temperature 25_226",
        type: "line",
        data: device2Data.map((item) => item.tem1),
      },
      {
        name: "Humidity 25_226",
        type: "line",
        data: device2Data.map((item) => item.hum1),
      },
    ],
  };

  return (
    <div className="p-4">
      <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />
    </div>
  );
};

const DataPage = () => {
  const searchParams = useSearchParams();
  const accessToken = searchParams ? searchParams.get("userData") : null;

  const [interval, setInterval] = useState("daily");
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
          onChange={(e) => setInterval(e.target.value)}
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
