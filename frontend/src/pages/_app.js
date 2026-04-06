import { store } from "../config/redux/store";
import { Provider } from "react-redux";
import "../styles/globals.css";
import "../components/navbar/navbar.css";
import Head from "next/head";


export default function App({ Component, pageProps }) {
  return <>
  <Provider store={store}>
     <Head>
        <title>CareerPilot ⭐ Connect with Purpose</title>
        <meta name="description" content="AI-powered career guidance platform" />
        <link rel="icon" type="image/png" href="/careerpilot_logo.png" />
      </Head>
    <Component {...pageProps} />
  </Provider>
  </>;
}
 