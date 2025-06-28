import React, { PureComponent } from "react";
import {LineChart, Line, XAxis, YAxis, CartesianAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer} from "recharts";

const LineGraph = ({data}) => {
    // some generated colors
    const COLORS = [
        '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE',
        '#00C49F', '#FFBB28', '#FF8042', '#d0ed57', '#a4de6c'
    ];

    // Get line count and names
    let lineNames = []
    if (data.length > 0) {
        lineNames = Object.keys(data[0]).filter(key => key !== 'name')
    }

    return (
        <ResponsiveContainer width="100%" aspect={3}>
            <LineChart
                width={900}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 20,
                    left: 15,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name"/>
                <YAxis domain={[0, 5]}/>
                <Tooltip/>
                <Legend/>
                {lineNames.map((name, index) =>
                    <Line key={name}
                          type="monotone"
                          dataKey={name}
                          stroke={COLORS[index % COLORS.length]}
                          dot={{r: 8}}
                          activeDot={{ r: 12 }}
                    />
                )}

            </LineChart>
        </ResponsiveContainer>

    )
}

export default LineGraph;