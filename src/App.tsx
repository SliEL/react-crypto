import React from "react";
import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import {
  convertTypeAcquisitionFromJson,
  createTypeReferenceDirectiveResolutionCache,
} from "typescript";

import { Crypto } from "./Types";
import CryptoSummary from "./components/CryptoSummary";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [cryptos, setCryptos] = useState<Crypto[] | null>(null);
  const [selected, setSelected] = useState<Crypto | null>();
  const [data, setData] = useState<ChartData<"line">>();
  const [options, setOptions] = useState<ChartOptions<"line">>({
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
      },
    },
  });
  useEffect(() => {
    const url =
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en";
    axios.get(url).then((response) => {
      setCryptos(response.data);
    });
  }, []);

  return (
    <div className="App">
      <>
        <select
          onChange={(e) => {
            const c = cryptos?.find((x) => x.id === e.target.value);
            console.log(c);
            setSelected(c);
            axios
              .get(
                `https://api.coingecko.com/api/v3/coins/${c?.id}/market_chart?vs_currency=usd&days=30&interval=daily`
              )
              .then((response) => {
                console.log(response.data);
                setData({
                  labels: response.data.prices.map((price: number[]) => {
                    const date = new Date(price[0]);
                    // format date eg: MM/DD//YYYY
                    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
                  }),
                  datasets: [
                    {
                      label: "data set 1",
                      data: response.data.prices.map((price: number[]) => {
                        return price[1];
                      }),
                      borderColor: "rgb(255,99,132)",
                      backgroundColor: "rgba(255,99,132,0.5)",
                    },
                  ],
                });
              });
          }}
          defaultValue="default"
        >
          <option value="default">Choose a cryptocurrency</option>
          {cryptos
            ? cryptos.map((crypto) => {
                return (
                  <option key={crypto.id} value={crypto.id}>
                    {crypto.name}
                  </option>
                );
              })
            : null}
        </select>
        {selected ? <CryptoSummary crypto={selected} /> : null}

        {data ? (
          <div style={{ width: 600 }}>
            <Line data={data} options={options} />{" "}
          </div>
        ) : null}
      </>
    </div>
  );
}

export default App;
