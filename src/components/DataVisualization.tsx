import ReactECharts from "echarts-for-react";
import { DataItem, Interval, GenerateXAxisData, DataVisualizationProps } from "../app/types";

function processData(data: DataItem[], interval: Interval): DataItem[] {
  const intervals: Record<Interval, number> = {
    daily: 24,
    weekly: 24 * 7,
    monthly: 24 * 7 * 4,
  };

  const intervalSize = intervals[interval];

  return data.slice(0, intervalSize);
}

// since the data didn't have correct timestamps, I generated them based on instructions that every data point is 1 hour apart and is retroactive
const generateXAxisData: GenerateXAxisData = (limit) => {
  const xAxisData: string[] = [];
  const startDate = new Date("2025-01-01T00:00:00");

  for (let i = 0; i < limit; i++) {
    const date = new Date(startDate.getTime() - i * 60 * 60 * 1000);
    xAxisData.unshift(date.toLocaleString());
  }

  return xAxisData;
};

const DataVisualization: React.FC<DataVisualizationProps> = ({ data, interval }) => {
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
      data: generateXAxisData(filteredData.length / 2),
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

export default DataVisualization;
