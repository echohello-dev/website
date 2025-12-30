"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ContributionChartProps {
  lastActivity?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function ContributionChart({
  lastActivity,
  createdAt,
  updatedAt,
}: ContributionChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !lastActivity || !createdAt) {
    return null;
  }

  // Generate sample contribution data based on project timeline
  const generateContributionData = () => {
    const data: { x: number; y: number }[] = [];
    const now = Date.now();
    const startTime = new Date(createdAt).getTime();
    const lastActivityTime = new Date(lastActivity).getTime();

    // Generate 30 data points representing activity over time
    for (let i = 0; i < 30; i++) {
      const timestamp = startTime + ((lastActivityTime - startTime) / 30) * i;
      const daysSinceActivity = (now - timestamp) / (1000 * 60 * 60 * 24);

      // Activity intensity decreases as we get closer to current time
      let intensity = Math.max(0, 100 - daysSinceActivity * 2);

      // Add some randomness for realistic look
      intensity = intensity * (0.5 + Math.random() * 0.5);

      data.push({
        x: timestamp,
        y: Math.round(intensity),
      });
    }

    return data;
  };

  const series = [
    {
      name: "Activity",
      data: generateContributionData(),
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      sparkline: {
        enabled: true,
      },
      background: "transparent",
      animations: {
        enabled: true,
        speed: 800,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#FFA217"],
    },
    grid: {
      show: false,
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100],
        colorStops: [
          {
            offset: 0,
            color: "#FFA217",
            opacity: 0.45,
          },
          {
            offset: 100,
            color: "#FFA217",
            opacity: 0.05,
          },
        ],
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      style: {
        fontSize: "11px",
        fontFamily: "var(--font-geist-mono, monospace)",
      },
      x: {
        format: "MMM dd, yyyy",
      },
      y: {
        formatter: (value: number) => `${Math.round(value)}% activity`,
      },
      marker: {
        show: true,
        fillColors: ["#FFA217"],
      },
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const value = series[seriesIndex][dataPointIndex];
        const date = new Date(
          w.globals.seriesX[seriesIndex][dataPointIndex]
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        return `
          <div style="background: #1a1a1a; border: 1px solid #FFA217; padding: 8px 12px; border-radius: 6px;">
            <div style="color: #FFA217; font-size: 11px; margin-bottom: 2px;">${date}</div>
            <div style="color: #e5e5e5; font-size: 12px; font-weight: 600;">${Math.round(value)}% activity</div>
          </div>
        `;
      },
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      min: 0,
      max: 100,
    },
  };

  return (
    <div className="w-full h-16">
      <Chart
        options={options}
        series={series}
        type="area"
        height="100%"
        width="100%"
      />
    </div>
  );
}
