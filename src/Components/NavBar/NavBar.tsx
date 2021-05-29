import {
  AppBar,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import CsvFileReader from "../CsvFileReader/CsvFileReader";
import { useAppSelector } from "../../store/hooks";
import { useDispatch } from "react-redux";
import {
  calculateSignsPT,
  calculateSignsQS,
  clearEkgData,
  setNavigateByR,
} from "../../store/ekgDataSlice";
import { HighlightOff } from "@material-ui/icons";
import { useToasts } from "react-toast-notifications";
import CSVFileSaveModal from "../CSVSaveModal/CSVFileSaveModal";

const useStyles = makeStyles({
  noMaxWidth: {
    maxWidth: "none",
    backgroundColor: "red",
  },
  noMaxWidthR: {
    maxWidth: "none",
    backgroundColor: "gray",
  },
  buttonNavigateStyle: {
    paddingRight: 10,
    color: "red",
  },
  buttonNavigateStyleR: {
    paddingRight: 10,
    color: "green",
  },
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
  closeIconStyle: {
    position: "absolute",
    right: 0,
    top: 0,
  },
});

interface NavBarProps {
  setCounter: React.Dispatch<React.SetStateAction<number>>;
}

const NavBar = ({ setCounter }: NavBarProps) => {
  const [openScvReader, setOpenCsvReader] = useState(false);
  const [CSVFileModalOpen, setCSVFileModalOpen] = useState(false);
  const ekgDataPlot = useAppSelector((state) => state.ekgData.ekg);
  const navigateByR = useAppSelector((state) => state.ekgData.navigateByR);
  const { calculateSignsPTDone, calculateSignsQSDone } = useAppSelector(
    (state) => state.ekgData.ekgDataInfo
  );
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
            ECG Data Analyzer
          </Typography>
          <ButtonGroup
            className={classes.menuButtonStyle}
            variant="text"
            color="inherit"
          >
            {ekgDataPlot.length === 0 ? null : (
              <Tooltip
                arrow
                classes={{
                  tooltip: navigateByR
                    ? classes.noMaxWidthR
                    : classes.noMaxWidth,
                }}
                title={
                  navigateByR ? (
                    <Typography variant={"h6"}>
                      Navigate by steps (default option)
                    </Typography>
                  ) : (
                    <Typography variant={"h6"}>
                      Make sure the R points are marked
                    </Typography>
                  )
                }
              >
                <Button
                  className={
                    navigateByR
                      ? classes.buttonNavigateStyleR
                      : classes.buttonNavigateStyle
                  }
                  onClick={() => {
                    setCounter(1);
                    dispatch(setNavigateByR());
                  }}
                >
                  Navigate by R ({navigateByR ? "ON" : "OFF"})
                </Button>
              </Tooltip>
            )}
            <Button
              disabled={
                ekgDataPlot.length === 0 ||
                (ekgDataPlot.length !== 0 && calculateSignsQSDone)
              }
              className={classes.loadFileButton}
              onClick={() => {
                dispatch(calculateSignsQS());
                addToast("Signs Q And S calculated successfully.", {
                  appearance: "success",
                  autoDismiss: true,
                });
              }}
            >
              Try calculate signs (Q,S)
            </Button>
            <Button
              disabled={
                !calculateSignsQSDone ||
                (calculateSignsQSDone && calculateSignsPTDone)
              }
              className={classes.loadFileButton}
              onClick={() => {
                dispatch(calculateSignsPT());
                addToast("Signs P and T calculated successfully.", {
                  appearance: "success",
                  autoDismiss: true,
                });
              }}
            >
              Try calculate signs (P,T)
            </Button>
            <Button
              className={classes.loadFileButton}
              onClick={() => setOpenCsvReader(true)}
            >
              Load from file
            </Button>
            <Button
              onClick={() => setCSVFileModalOpen(true)}
              disabled={ekgDataPlot.length === 0}
            >
              Save to file
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
      <CSVFileSaveModal
        CSVFileModalOpen={CSVFileModalOpen}
        setCSVFileModalOpen={setCSVFileModalOpen}
      />
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
