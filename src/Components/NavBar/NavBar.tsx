import {
  AppBar,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import CsvFileReader from "../CsvFileReader/CsvFileReader";
import { useAppSelector } from "../../store/hooks";
import { useDispatch } from "react-redux";
import { clearEkgData } from "../../store/ekgDataSlice";
import { HighlightOff } from "@material-ui/icons";
import { CSVDownloader } from "react-papaparse";
import { useToasts } from "react-toast-notifications";

const useStyles = makeStyles({
  logoTextStyle: {
    fontSize: 45,
    fontWeight: "bold",
    userSelect: "none",
    fontFamily: "Indie Flower",
    "&:hover": {
      cursor: "pointer",
    },
  },
  loadFileButton: {
    "&:after": {
      backgroundColor: "red",
    },
  },
  appBarStyle: {
    border: "solid 2px gray",
    borderRadius: "20px",
  },
  menuButtonStyle: {
    position: "absolute",
    right: "30px",
  },
  downloadLinkStyle: {
    color: "black",
    textDecoration: "none",
  },
  disabledDownloadLinkStyle: {
    color: "rgba(0, 0, 0, 0.26)",
    textDecoration: "none",
  },
  closeIconStyle: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});

const NavBar = () => {
  const [openScvReader, setOpenCsvReader] = useState(false);
  const ekgDataPlot = useAppSelector((state) => state.ekgData.ekg);
  let history = useHistory();
  const { addToast } = useToasts();
  const dispatch = useDispatch();

  const ref = React.createRef();

  const homePageHandle = () => {
    history.push("/");
  };

  const classes = useStyles();
  return (
    <>
      <AppBar
        className={classes.appBarStyle}
        color={"inherit"}
        position="static"
      >
        <Toolbar>
          <Typography
            onClick={homePageHandle}
            className={classes.logoTextStyle}
            variant="h4"
          >
            ECG Data Selector
          </Typography>
          <ButtonGroup
            className={classes.menuButtonStyle}
            variant="text"
            color="inherit"
          >
            <Button
              className={classes.loadFileButton}
              onClick={() => setOpenCsvReader(true)}
            >
              Load from file
            </Button>
            <Button disabled={ekgDataPlot.length === 0}>
              <CSVDownloader
                filename={"ECGDataFile"}
                className={
                  ekgDataPlot.length === 0
                    ? classes.disabledDownloadLinkStyle
                    : classes.downloadLinkStyle
                }
                data={ekgDataPlot}
              >
                Save to file
              </CSVDownloader>
            </Button>
            <Button
              disabled={ekgDataPlot.length === 0}
              onClick={() => {
                dispatch(clearEkgData());
                addToast("File Removed.", {
                  appearance: "error",
                  autoDismiss: true,
                });
              }}
            >
              Remove file
            </Button>
          </ButtonGroup>
        </Toolbar>
      </AppBar>
      <Dialog
        PaperProps={{
          style: {
            padding: 18,
            border: "solid 2px grey",
            borderRadius: 40,
            textAlign: "center",
          },
        }}
        open={openScvReader}
        onClose={() => setOpenCsvReader(false)}
      >
        <DialogTitle disableTypography={true}>
          <IconButton
            onClick={() => setOpenCsvReader(false)}
            className={classes.closeIconStyle}
          >
            <HighlightOff />
          </IconButton>
          <Typography variant={"h3"}> Select file to read data</Typography>
          <Typography variant={"inherit"}>
            (*.csv data format: TimeStamp, ECG value, Sign)
          </Typography>
        </DialogTitle>
        <DialogContent>
          <CsvFileReader childRef={ref} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NavBar;
