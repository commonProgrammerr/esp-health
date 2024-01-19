import Head from "next/head";
import styles from "@/styles/Home.module.css";
import { api } from "@/services/api";
import { useAsyncFn } from "react-use";
import type { IDevicesFilter } from "@/@types";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Device } from "@/models";
import Table from "@/components/Table";
import { formatDate } from "@/utils/formatDate";
import Header from "@/components/Header";
import styled from "styled-components";
import Link from "next/link";
import { PrintIcon } from "@/components/PrintIcon";
import LogDialog from "@/components/LogDialog";
import { DeviceStatus, getStatusText, status_texts } from "@/utils/enums";
import { Select, getStatusStyle } from "@/components/Select";

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
        <Select
          styles={{ flex: 0, minWidth: 200 }}
          value={filter}
          options={[
            {
              name: status_texts[DeviceStatus.BROKEN],
              value: String(DeviceStatus.BROKEN),
            },
            {
              name: status_texts[DeviceStatus.NEW],
              value: String(DeviceStatus.NEW),
            },
            {
              name: status_texts[DeviceStatus.PRINTED],
              value: String(DeviceStatus.PRINTED),
            },
            {
              name: status_texts[DeviceStatus.REDY],
              value: String(DeviceStatus.REDY),
            },
            {
              name: "Todos",
              value: "all",
            },
          ]}
          placeholder="Todos"
          onChange={(value) => {
            console.log(DeviceStatus[value]);
            router.query.filter = value;
            router.push(router);
            reload(value ? { status: value } : {});
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
            actions: " ",
          }}
          data={
            value?.data.map(({ id, ticket_downloads, status, updated_at }) => ({
              id,
              ticket_downloads,
              status: (
                <StatusTag style={getStatusStyle(status)}>
                  {getStatusText(status)}
                </StatusTag>
              ),
              updated_at: formatDate(new Date(updated_at)),
              actions: (
                <Actions>
                  {(status === DeviceStatus.REDY ||
                    status === DeviceStatus.PRINTED) && (
                    <Link href={`/api/print?id=${id}`} type="button">
                      <PrintIcon />
                    </Link>
                  )}
                  <LogDialog testeId={id} />
                </Actions>
              ),
            })) || []
          }
        />
      </main>
    </>
  );
}

const StatusTag = styled.span`
  padding: 0.45rem;
  display: flex;
  align-items: center;
  justify-content: center;

  flex: 0;
  min-width: 100px;
  max-width: 125px;
  font-weight: bold;
  border-radius: 1rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  padding-right: 3.5vw;

  a,
  button {
    font-weight: bold;
    border-radius: 100%;
    padding: 0.5em;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2980b9;
    color: var(--bg-light);
  }
`;
