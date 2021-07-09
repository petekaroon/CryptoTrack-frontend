import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
// material
import { Container, Typography, Grid, Button } from '@material-ui/core';
// components
import Page from '../components/Page';
import LoadingScreen from '../components/LoadingScreen';
import { CurrentBalance, TotalProfitLoss, Overview, CryptoAssets, AddTransactionButton } from '../components/portfolio';
// api
import { loadPortfolio } from '../api/Main';

// ----------------------------------------------------------------------

function convertCollection(obj) {
  const keys = Object.keys(obj);
  return keys.map((key) => ({ slug: key, ...obj[key] }));
}

function getCurrentTime() {
  const inputDateStr = new Date().toLocaleString('en-CA');
  const dateArr = inputDateStr.split(' ');
  const dateStr = dateArr[0].slice();
  const timeStr = dateArr[1].slice();
  const amPmStr = `${dateArr[2][0].toUpperCase()}${dateArr[2][2].toUpperCase()}`;

  return `${dateStr} ${timeStr} ${amPmStr}`;
}

export default function Portfolio() {
  const [mainApiStatusCode, setMainApiStatusCode] = useState();
  const [coinApiStatusCode, setCoinApiStatusCode] = useState();
  const [supportedCryptosStatusCode, setSupportedCryptosStatusCode] = useState();
  const [error, setError] = useState();
  const [mainApiData, setMainApiData] = useState();
  const [coinApiData, setCoinApiData] = useState();
  const [supportedCryptos, setSupportedCryptos] = useState();
  const [lastUpdate, setLastUpdate] = useState(getCurrentTime());

  const handleSetLastUpdate = () => {
    setLastUpdate(getCurrentTime());
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setError(null);

      try {
        const { mainApiResponse, coinApiResponse, supportedCryptosResponse } = await loadPortfolio();

        if (isMounted) {
          setMainApiData(mainApiResponse.data);
          setCoinApiData(convertCollection(coinApiResponse.data));
          setSupportedCryptos(supportedCryptosResponse.data);
          setMainApiStatusCode(mainApiResponse.status);
          setCoinApiStatusCode(coinApiResponse.status);
          setSupportedCryptosStatusCode(supportedCryptosResponse.status);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.response);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [lastUpdate]);

  return (
    <>
      {error && error.status === 401 && <Navigate to="/auth/login" />}
      {error && error.status !== 401 && <Navigate to="/page404" />}
      {(!mainApiData || !coinApiData || !supportedCryptos) && <LoadingScreen />}

      {mainApiStatusCode === 200 && coinApiStatusCode === 200 && supportedCryptosStatusCode === 200 && (
        <Page title="Portfolio | CryptoTrack">
          <Container maxWidth="xl">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={8}>
                <Typography variant="h3">Your Portfolio</Typography>
                <Typography sx={{ color: 'text.secondary' }}>Track your crypto assets investment.</Typography>
              </Grid>

              <Grid container item xs={12} sm={4}>
                <Grid item xs={12}>
                  <Typography paragraph align="center" variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Last update: &nbsp; {lastUpdate}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Button fullWidth size="medium" variant="contained" onClick={handleSetLastUpdate}>
                    Update Latest Price
                  </Button>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Overview mainApiData={mainApiData} coinApiData={coinApiData} />
              </Grid>

              <Grid container spacing={3} item xs={12} sm={6}>
                <Grid item xs={12}>
                  <CurrentBalance mainApiData={mainApiData} coinApiData={coinApiData} />
                </Grid>

                <Grid item xs={12}>
                  <TotalProfitLoss mainApiData={mainApiData} coinApiData={coinApiData} />
                </Grid>

                <Grid item xs={12}>
                  <AddTransactionButton supportedCryptos={supportedCryptos} handleSetLastUpdate={handleSetLastUpdate} />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <CryptoAssets
                  mainApiData={mainApiData}
                  coinApiData={coinApiData}
                  handleSetLastUpdate={handleSetLastUpdate}
                />
              </Grid>
            </Grid>
          </Container>
        </Page>
      )}
    </>
  );
}
