import React from "react";
import { PieChart, Pie, Tooltip } from "recharts";

function percentage(partialValue, totalValue) {
  return (100 * partialValue) / totalValue;
}

export const Charts = props => {
  const chartData = [];
  if (props.data && props.showPercentage) {
    const totalvalue = Object.values(props.data)
      .filter(e => e !== 0)
      .reduce((a, b) => a + b, 0);
    for (let key in props.data) {
      if (props.data[key]) {
        let percentageValue = percentage(props.data[key], totalvalue).toFixed(
          2
        );
        chartData.push({
          name: key,
          value: parseFloat(percentageValue)
        });
      }
    }
  } else if (props.data && !props.showPercentage) {
    for (let key in props.data) {
      if (props.data[key])
        chartData.push({ name: key, value: props.data[key] });
    }
  }

  return (
    <PieChart width={120} height={120}>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        innerRadius={30}
        outerRadius={50}
        paddingAngle={5}
        fill="#8884d8"
      />
      <Tooltip />
    </PieChart>
  );
};
