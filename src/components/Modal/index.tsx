import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
    Alert,
    Divider,
    IconButton,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import React, { ChangeEvent, useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { globalContext } from "../../store/globalState";
import { ICrypto } from "../../types/ICrypo";

const useStyles = makeStyles()((theme) => {
    return {
        modal: {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 900,
            border: "1px solid #fff",
            background: "white",
        },
        header: {
            padding: "20px",
        },
        form: {
            padding: theme.spacing(2),
            display: "flex",
            flexDirection: "column",
            rowGap: "20px",
        },
        actions: {
            marginBottom: theme.spacing(3),
            textAlign: "center",
            display: "flex",
            columnGap: "15px",
            justifyContent: "flex-end",
        },
    };
});

const ALLOWED_CRYPTO_SYMBOLS = ["BTC", "ETH", "USDT", "BNB", "USDC", "XPR"];

interface ICryptoForm {
    name: string;
    price: number;
    symbol: string;
}


type ModalProps = {
    open: boolean;
    data: ICrypto | null;
    setOpen: (open: boolean) => void;
    setEditData: (item: ICrypto | null) => void;
};

export default function BasicModal(props: ModalProps) {
    const { classes } = useStyles();
    const { setCrypto } = React.useContext(globalContext);
    const [error, setError] = useState<string | null>(null);

    const [data, setData] = useState<ICryptoForm>({
        name: props.data ? props.data.name : "",
        price: props.data ? props.data.price : 0,
        symbol: props.data ? props.data.symbol : ALLOWED_CRYPTO_SYMBOLS[0],
    });

    useEffect(() => {
        setData({
            name: props.data ? props.data.name : "",
            price: props.data ? props.data.price : 0,
            symbol: props.data ? props.data.symbol : ALLOWED_CRYPTO_SYMBOLS[0],
        });
    }, [props.data]);

    const handleOpen = () => {
        props.setOpen(true);
        props.setEditData(null);
    };

    const handleClose = () => props.setOpen(false);

    const handleSubmit = () => {
        setError(null);
        const savedData = JSON.parse(localStorage.getItem("crypto-data") || "[]");
        const itemIndex = savedData.findIndex(
            (item: ICrypto) => props.data ? (props.data.symbol !== item.symbol && item.symbol === data.symbol) : item.symbol === data.symbol
        );
        if (itemIndex >= 0) {
            return setError("A currency with this symbol already exists!");
        }
        if (props.data) {
            const index = savedData.findIndex(
                (item: ICrypto) => item.symbol === props.data?.symbol
            );
            if (index >= 0) {
                savedData[index].name = data.name;
                savedData[index].symbol = data.symbol;
                savedData[index].price = data.price;
                localStorage.setItem("crypto-data", JSON.stringify(savedData));
                setCrypto(savedData);
            }
        } else {
            localStorage.setItem("crypto-data", JSON.stringify([...savedData, data]));
            setCrypto([...savedData, data]);
        }
        props.setOpen(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.currentTarget.name]: e.currentTarget.value,
        });
    };

    const handleSelect = (e: any) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div>
            <IconButton onClick={handleOpen}>
                <AddCircleIcon sx={{ fontSize: "50px" }} />
            </IconButton>
            <Modal open={props.open} onClose={handleClose}>
                <Box className={classes.modal}>
                    <Typography
                        variant="h4"
                        component="h2"
                        textAlign="center"
                        className={classes.header}
                    >
                        {props.data ? "Edit" : "Add"} Currency Detail
                    </Typography>
                    <Divider />
                    {error && <Alert severity="error">{error}</Alert>}
                    {
                        <form className={classes.form}>
                            <TextField
                                label="Name"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                fullWidth
                            />
                            <Select
                                name="symbol"
                                value={data.symbol}
                                label="Symbol"
                                fullWidth
                                onChange={handleSelect}
                            >
                                {ALLOWED_CRYPTO_SYMBOLS.map((item: string) => (
                                    <MenuItem key={item} value={item}>
                                        {item}
                                    </MenuItem>
                                ))}
                            </Select>
                            <TextField
                                label="Price"
                                type="number"
                                name="price"
                                fullWidth
                                value={data.price}
                                onChange={handleChange}
                            />

                            <div className={classes.actions}>
                                <Button variant="outlined" color="primary" onClick={handleSubmit}>
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => props.setOpen(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    }
                </Box>
            </Modal>
        </div>
    );
}
