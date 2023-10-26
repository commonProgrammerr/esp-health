import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Row } from "@/components/Row";
import { useFetch } from "@/hooks/useFetch";

const inter = Inter({ subsets: ["latin"] });

interface IDataFech {
  devices: [
    {
      mac: string;
      chipID: string;
      date: string;
    }
  ];
  date: Date;
}

export default function Home() {
  const { data, error } = useFetch<IDataFech>("./api/logs");

  if (error) console.error(error);

  return (
    <>
      <Head>
        <title>Health board</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div className={styles.head}>
          <span>MAC</span>
          <span>ChipID</span>
          <span>Data</span>
        </div>
        <div className={styles.content}>
          {data?.devices.map((device, index) => (
            <Row key={`device_${device.mac}_${index}`} data={device} />
          ))}
        </div>
      </main>
    </>
  );
}
