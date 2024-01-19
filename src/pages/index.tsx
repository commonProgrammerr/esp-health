import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { api } from "@/services/api";
import { useAsyncFn } from "react-use";
import type { IDevicesFilter } from "@/@types";
import Image from "next/image";
import logo_image from "@public/logo.png";
import { Select } from "@/components/Select";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Device } from "@/models";
import { DeviceStatus, status_texts } from "@/utils/enums";
import Table from "@/components/Table";
import { formatDate } from "@/utils/formatDate";
import styled from "styled-components";

export default function Home() {
  const router = useRouter();
  const filter = router.query.filter?.toString();

  const [{ loading, error, value }, reload] = useAsyncFn(
    async (filter: IDevicesFilter) => {
      return api.post<Device[]>("/devices", {
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
      <Header>
        <Image
          src={logo_image}
          alt="logo"
          style={{
            width: "100%",
            // width: "auto",
            height: "auto",
          }}
        />
      </Header>
      <main className={styles.main}>
        <Table
          columns={{
            id: "MAC",
            status: "Status",
            ticket_downloads: "Impressões",
            updated_at: "Data",
          }}
          data={
            value?.data.map(({ id, ticket_downloads, status, updated_at }) => ({
              id,
              ticket_downloads,
              status,
              updated_at: formatDate(new Date(updated_at)),
            })) || []
          }
        />
      </main>
    </>
  );
}

const Header = styled.header`
  border: 1px red solid;

  img {
    border: 1px green solid;
    max-width: 150px;
  }

  max-height: 14vh;
`;
