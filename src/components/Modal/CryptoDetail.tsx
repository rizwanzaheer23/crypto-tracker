import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "tss-react/mui";
import { Divider, Typography } from "@mui/material";
import { ICurrencyDetails } from "../../types/ICrypo";

const useStyles = makeStyles()((theme) => {
  return {
    heading: {
      paddingBottom: "20px",
    },
    modal: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 900,
      border: "1px solid #fff",
      background: "white",
      padding: "20px",
      borderRadius: "10px",
    },
    itemsWrapper: {
      padding: "30px 0",
    },
    itemWrapper: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 10px",
    },
    loaderWrapper: {
      height: "100vh",
      display: "flex",
      alignItems: 'center',
      justifyContent: 'center'
    },
    loader: {
      marginTop: '25px',
      marginBottom: '25px'
    }
  };
});

type ModalProps = {
  open: boolean;
  loading: boolean;
  data: ICurrencyDetails | null;
  setOpen: (open: boolean) => void;
};

export default function CryptoDetail(props: ModalProps) {
  const { classes } = useStyles();
  const handleClose = () => props.setOpen(false);

  return (
    <Modal open={props.open} onClose={handleClose}>
      <Box className={classes.modal}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          className={classes.heading}>
          Details
        </Typography>
        <Divider />
        {props.loading ? (
          <Box display="flex" alignItems="center" justifyContent="center">
            <CircularProgress className={classes.loader} />
          </Box>
        ) : (
          <Box className={classes.itemsWrapper}>
            {
              props.data && Object.entries(props.data).map(([key, value], i) => {
                return <Typography key={i}>{key}: {value}</Typography>;
              })
            }
          </Box>
        )}
      </Box>
    </Modal>
  );
}
