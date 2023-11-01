import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Row } from "@/components/Row";
import { useFetch } from "@/hooks/useFetch";
import Link from "next/link";

interface IDataFech {
  devices: [
    {
      mac: string;
      status: string;
      date: string;
    }
  ];
  date: Date;
}

export default function Home() {
  const { data, error } = useFetch<IDataFech>("./api/devices", {
    headers: {
      all: true,
    } as any,
  });

  if (error) console.error(error);

  return (
    <>
      <Head>
        <title>Health board</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.head}>
          <span>MAC</span>
          <span style={{ alignSelf: "center" }}>Data</span>
          <span>Status</span>
          <span>
            <Link href="/">Pass</Link>
          </span>
        </div>
        {data?.devices.map((dv, i) => (
          <Row key={i} data={dv} />
        ))}
      </main>
    </>
  );
}
