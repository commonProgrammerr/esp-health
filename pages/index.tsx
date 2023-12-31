import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { Row } from "@/components/Row";
import { api } from "@/utils/api";
import { useAsyncFn, useEffectOnce } from "react-use";
import type { IDevicesFilter, IDevicesResponse } from "@/types";
import Image from "next/image";
import { StatusTypes } from "@/utils/enums";
import logo_image from "@/public/logo.png";
import { Select } from "@/components/Select";
import { useRouter } from "next/router";
import { useEffect } from "react";

const filters = Object.values(StatusTypes);

export default function Home() {
  const router = useRouter();
  const filter = router.query.filter?.toString();

  const [{ loading, error, value }, reload] = useAsyncFn(
    async (filter: IDevicesFilter) => {
      return api.post<IDevicesResponse>("/devices", {
        filter,
      });
    },
    []
  );

  useEffect(() => {
    reload(filter ? { status: filter } : {});
  }, [router.query]);

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
          <span id="logo_container">
            <Image
              src={logo_image}
              alt="logo"
              style={{
                width: "100%",
                height: "auto",
              }}
            />
          </span>
          <span>MAC</span>
          <span>Data</span>
          <span>Status</span>
          <div>
            <Select
              value={filter}
              options={filters}
              placeholder="Todos"
              onChange={(value) => {
                router.query.filter = value;
                router.push(router);
                reload(value ? { status: value } : {});
              }}
            />
          </div>
        </div>
        {value?.data.devices.map((dv, i) => (
          <Row key={i} data={dv} />
        ))}
      </main>
    </>
  );
}
