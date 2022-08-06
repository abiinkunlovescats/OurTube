import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Input } from "postcss";
import { downloader } from "../components/downloader";
import styles from "../styles/Home.module.css";
import BodyItems from "../components/lol";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>OurTube.js</title>
        <meta name="description" content="Download Youtube Videos" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className="font-bold text-6xl">
          Welcome to{" "}
          <a
            className="font-thin text-blue-800 underline top"
          >
            OurTube.js
          </a>
        </h1>
        
        <div className="w-full max-w-xs"><BodyItems/></div>
      </main>

      
    </div>
  );
};

export default Home;
