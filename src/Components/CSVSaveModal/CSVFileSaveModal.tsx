import {
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { SetStateAction, useState } from "react";
import { CSVDownloader } from "react-papaparse";
import { makeStyles } from "@material-ui/core/styles";
import { useAppSelector } from "../../store/hooks";
import { HighlightOff } from "@material-ui/icons";

const useStyles = makeStyles({
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
  disableButton: {
    marginTop: 20,
    borderRadius: 40,
  },
  positiveButton: {
    background: "#4caf50",
    "&:hover": {
      background: "#388e3c",
    },
  },
  actionButtonStyle: {
    marginTop: 20,
    borderRadius: 40,
  },
});

interface CSVFileSaveModalProps {
  CSVFileModalOpen: boolean;
  setCSVFileModalOpen: React.Dispatch<SetStateAction<boolean>>;
}

const CSVFileSaveModal = (props: CSVFileSaveModalProps) => {
  const ekgDataPlot = useAppSelector((state) => state.ekgData.ekg);
  const [fileName, setFileName] = useState("");
  const [touch, setTouch] = useState(false);
  const classes = useStyles();
  return (
    <Dialog
      PaperProps={{
        style: {
          padding: 18,
          border: "solid 2px grey",
          borderRadius: 40,
          textAlign: "center",
        },
      }}
      onClose={() => {
        props.setCSVFileModalOpen(false);
        setFileName("");
        setTouch(false);
      }}
      open={props.CSVFileModalOpen}
    >
      <DialogTitle disableTypography={true}>
        <IconButton
          onClick={() => {
            props.setCSVFileModalOpen(false);
            setFileName("");
            setTouch(false);
          }}
          className={classes.closeIconStyle}
        >
          <HighlightOff />
        </IconButton>
        <Typography variant={"h3"}>Save data to new file</Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              error={!fileName.length && touch}
              onClick={() => setTouch(true)}
              fullWidth
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              variant={"outlined"}
              placeholder={"Set file name"}
              helperText={!fileName.length && touch ? "Required" : null}
            />
          </Grid>

          <ButtonGroup color="primary" fullWidth>
            <Button
              className={
                fileName === ""
                  ? classes.disableButton
                  : `${classes.actionButtonStyle} ${classes.positiveButton}`
              }
              disabled={fileName === ""}
            >
              <CSVDownloader
                filename={fileName}
                className={
                  fileName === ""
                    ? classes.disabledDownloadLinkStyle
                    : classes.downloadLinkStyle
                }
                data={ekgDataPlot}
              >
                Save
              </CSVDownloader>
            </Button>
          </ButtonGroup>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CSVFileSaveModal;
