"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ContributionChartProps {
  commitActivity?: { week: number; commits: number }[];
}

type TimeRange = "1m" | "6m" | "12m" | "5y";

export default function ContributionChart({
  commitActivity,
}: ContributionChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("12m");

  if (!commitActivity || commitActivity.length === 0) {
    return null;
  }

  // Calculate date ranges
  const now = new Date();
  const getDateRange = (range: TimeRange): Date => {
    const date = new Date(now);
    switch (range) {
      case "1m":
        date.setMonth(date.getMonth() - 1);
        break;
      case "6m":
        date.setMonth(date.getMonth() - 6);
        break;
      case "12m":
        date.setFullYear(date.getFullYear() - 1);
        break;
      case "5y":
        date.setFullYear(date.getFullYear() - 5);
        break;
    }
    return date;
  };

  const startDate = getDateRange(timeRange).getTime();

  // Filter activity data by time range
  const filteredActivity = commitActivity.filter(
    (item) => item.week >= startDate
  );

  // Find max commits for normalization
  const maxCommits = Math.max(...filteredActivity.map((d) => d.commits));

  // Use filtered commit activity data
  const getRealContributionData = () => {
    // Group commits by 7-day periods
    const weeklyData = new Map<number, number>();

    filteredActivity.forEach((item) => {
      const date = new Date(item.week);
      // Get the start of the week (Sunday)
      const dayOfWeek = date.getDay();
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - dayOfWeek);
      weekStart.setHours(0, 0, 0, 0);
      const weekTimestamp = weekStart.getTime();

      // Sum commits for this week
      weeklyData.set(
        weekTimestamp,
        (weeklyData.get(weekTimestamp) || 0) + item.commits
      );
    });

    // Convert to array and sort by date
    const data = Array.from(weeklyData.entries())
      .map(([timestamp, commits]) => ({
        x: timestamp,
        y: commits,
      }))
      .sort((a, b) => a.x - b.x);

    // Add a point at today to extend the line to current date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDataPoint = data[data.length - 1];

    // Only add today's point if it's after the last data point
    if (!lastDataPoint || lastDataPoint.x < today.getTime()) {
      data.push({
        x: today.getTime(),
        y: lastDataPoint?.y || 0,
      });
    }

    return data;
  };

  const series = [
    {
      name: "Commits",
      data: getRealContributionData(),
    },
  ];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

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
        formatter: (value: number) =>
          `${value} commit${value !== 1 ? "s" : ""}`,
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
            <div style="color: #e5e5e5; font-size: 12px; font-weight: 600;">${value} commit${value !== 1 ? "s" : ""}</div>
          </div>
        `;
      },
    },
    xaxis: {
      type: "datetime",
      max: tomorrow.getTime(),
    },
    yaxis: {
      min: 0,
      max: maxCommits > 0 ? Math.ceil(maxCommits * 1.1) : 10,
      show: false,
      labels: {
        show: false,
      },
    },
    markers: {
      size: 0,
      colors: ["#FFA217"],
      strokeColors: "#FFA217",
      strokeWidth: 1,
      hover: {
        size: 6,
      },
    },
    annotations: {
      xaxis: [
        {
          x: tomorrow.getTime(),
          strokeDashArray: 0,
          borderColor: "#FFA217",
          label: {
            borderColor: "#FFA217",
            style: {
              color: "#1a1a1a",
              background: "#FFA217",
              fontSize: "11px",
              fontWeight: 600,
              fontFamily: "var(--font-geist-mono, monospace)",
            },
            text: tomorrow.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            position: "right",
          },
        },
      ],
    },
  };

  return (
    <div className="w-full">
      {/* Time Range Tabs */}
      <div className="flex gap-1 mb-2">
        {(["1m", "6m", "12m", "5y"] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-2 py-0.5 text-[10px] font-normal rounded transition-colors ${
              timeRange === range
                ? "bg-accent/20 text-accent border border-accent/40"
                : "bg-transparent border border-border/50 text-muted hover:border-accent/40 hover:text-accent"
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full h-16">
        <Chart
          options={options}
          series={series}
          type="area"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
}
