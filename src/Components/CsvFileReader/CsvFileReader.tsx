import React, { useRef } from "react";
import { CSVReader } from "react-papaparse";
import { useDispatch } from "react-redux";
import { clearEkgData, saveEkgData } from "../../store/ekgDataSlice";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Button, Typography } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";

const useStyles = makeStyles({
  positiveButton: {
    background: "#4caf50",
    "&:hover": {
      background: "#388e3c",
    },
  },
  actionButtonStyle: {
    borderRadius: 40,
    width: "150px",
    height: "50px",
    marginLeft: "50px",
    marginRight: "50px",
  },
  fileNameStyle: {
    height: 20,
  },
});

interface CsvFileReaderProps {
  childRef: any;
}

const CsvFileReader = (props: CsvFileReaderProps) => {
  const classes = useStyles();
  const { addToast } = useToasts();
  const buttonRef = useRef(props.childRef);

  const dispatch = useDispatch();

  const handleOpenDialog = (e: any) => {
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const handleOnFileLoad = (data: any) => {
    dispatch(clearEkgData());
    dispatch(saveEkgData(data));
    addToast("File Loaded Successfully.", {
      appearance: "success",
      autoDismiss: true,
    });
  };

  const handleOnError = (err: any) => {
    addToast(err.message, { appearance: "error", autoDismiss: true });
  };

  const handleRemoveFile = () => {
    if (buttonRef.current) {
      buttonRef.current.removeFile();
      dispatch(clearEkgData());
      addToast("File Removed.", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  return (
    <>
      <CSVReader
        ref={buttonRef}
        onFileLoad={handleOnFileLoad}
        onError={handleOnError}
        noClick
        noDrag
        noProgressBar
      >
        {
          // @ts-ignore
          ({ file }) => (
            <>
              <Typography className={classes.fileNameStyle} variant={"h4"}>
                {file && file.name}
              </Typography>
              <Box paddingTop={10}>
                <Button
                  className={`${classes.actionButtonStyle} ${classes.positiveButton}`}
                  variant="contained"
                  color={"primary"}
                  onClick={handleOpenDialog}
                >
                  Browse file
                </Button>
                <Button
                  disabled={!file}
                  variant="contained"
                  color={"secondary"}
                  onClick={handleRemoveFile}
                  className={classes.actionButtonStyle}
                >
                  Remove
                </Button>
              </Box>
            </>
          )
        }
      </CSVReader>
    </>
  );
};

export default CsvFileReader;
