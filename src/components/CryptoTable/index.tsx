import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Box,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { globalContext } from "../../store/globalState";
import { ICrypto, ICurrencyDetails } from "../../types/ICrypo";
import BasicModal from "../Modal";
import CryptoDetail from "../Modal/CryptoDetail";
import { sendGetRequest } from "../../utils/api";

const useStyles = makeStyles()((theme) => {
  return {
    searchWrapper: {
      display: "flex",
      alignItems: "center",
    },
    tableHead: {
      backgroundColor: "gray",
      width: "100%",
    },
    tableCell: {
      color: "white",
      fontWeight: "700",
    },
    row: {
      backgroundColor: "#fff",
      cursor: "pointer",

      "&:hover": {
        backgroundColor: "#F5F5F5",
      },
    },
    actions: {
      display: "flex",
      columnGap: "5px",
    },
    loaderWrapper: {
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };
});

const CryptoTable = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<ICrypto | null>(null);
  const { crypto, setCrypto } = useContext(globalContext);
  const { classes } = useStyles();
  const [loading, setLoading] = useState<boolean>(false);
  const [symbolRecords, setSymbolRecords] = useState<ICurrencyDetails | null>(
    null
  );
  const [showCryptoDetailModal, setShowCryptoDetailModal] = useState<boolean>(
    false
  );

  let filterCrypto =
    crypto &&
    crypto.filter((item: ICrypto) => {
      return item && item.name && item.name.toLowerCase().includes(search);
    });

  const handleDelete = (symbol: string) => {
    const filterData = crypto.filter((data: ICrypto) => {
      return data.symbol !== symbol;
    });
    localStorage.setItem("crypto-data", JSON.stringify(filterData));
    setCrypto(filterData);
  };

  const handleEdit = (item: ICrypto) => {
    setEditData(item);
    setOpen(true);
  };

  const loadSymbolData = async (symbol: string) => {
    setLoading(true);
    setShowCryptoDetailModal(true);
    try {
      const { data } = await sendGetRequest('/assets');
      const fitlered = data.data.find(
        (item: any) => item.symbol === symbol
      );
      setSymbolRecords({
        name: fitlered.name,
        symbol: fitlered.symbol,
        last_trade_at: fitlered.metrics.market_data.last_trade_at,
        percent_change_btc_last_24_hours:
          fitlered.metrics.market_data.percent_change_btc_last_24_hours,
        volume_last_24_hours:
          fitlered.metrics.market_data.volume_last_24_hours,
        price_btc: fitlered.metrics.market_data.price_btc,
        price_usd: fitlered.metrics.market_data.price_usd,
      });
      setLoading(false);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ textAlign: "center", marginTop: "20px" }}>
      <Typography variant="h4" maxWidth="100%">
        Crypto Tracker
      </Typography>
      <Box className={classes.searchWrapper}>
        <TextField
          label="Search Currency"
          variant="outlined"
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
        />
        <BasicModal
          data={editData}
          open={open}
          setOpen={setOpen}
          setEditData={setEditData}
        />
      </Box>
      <TableContainer>
        {crypto && crypto.length < 0 ? (
          <Box className={classes.loaderWrapper}>
            <CircularProgress />
          </Box>
        ) : (
          <Table>
            <TableHead className={classes.tableHead}>
              <TableRow>
                {["Coin", "Price", "Symbol", "Action"].map((heading) => {
                  return (
                    <TableCell className={classes.tableCell} key={heading}>
                      {heading}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {filterCrypto &&
                filterCrypto.map((row: ICrypto, i: number) => {
                  return (
                    <TableRow className={classes.row} key={i}>
                      <TableCell component="th" scope="row">
                        <span>{row.name}</span>
                      </TableCell>
                      <TableCell>{row.price}</TableCell>
                      <TableCell>{row.symbol}</TableCell>
                      <TableCell className={classes.actions}>
                        <VisibilityIcon
                          onClick={() => loadSymbolData(row.symbol)}
                        />
                        <EditIcon onClick={() => handleEdit(row)} />
                        <DeleteForeverIcon
                          onClick={() => handleDelete(row.symbol)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        )}
      </TableContainer>
      <CryptoDetail
        loading={loading}
        data={symbolRecords}
        open={showCryptoDetailModal}
        setOpen={setShowCryptoDetailModal}
      />
    </Container>
  );
};

export default CryptoTable;
