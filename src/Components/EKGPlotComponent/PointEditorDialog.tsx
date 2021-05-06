import {
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useDispatch } from "react-redux";
import { addSign } from "../../store/ekgDataSlice";
import { useToasts } from "react-toast-notifications";

const useStyles = makeStyles({
  modalButtonStyle: {
    marginTop: "20px",
    marginBottom: "10px",
    width: 100,
  },
  editButtonStyle: {
    color: "white",
    background: "#4caf50",
    "&:hover": {
      background: "#388e3c",
    },
  },
  modalContentStyle: {
    textAlign: "left",
  },
  quickSelectSignStyle: {
    marginTop: "20px",
    marginBottom: "15px",
  },
  quickOptionHints: {
    textAlign: "center",
    color: "gray",
  },
});

interface SelectedPointProps {
  x: number;
  y: number;
  index: number;
  sign: string;
}

interface PointEditorDialogProps {
  openPointModal: boolean;
  setSelectedPoint: React.Dispatch<React.SetStateAction<SelectedPointProps>>;
  setOpenPointModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedPoint: SelectedPointProps | undefined;
}

const PointEditorDialog = ({
  openPointModal,
  setOpenPointModal,
  selectedPoint,
  setSelectedPoint,
}: PointEditorDialogProps) => {
  const { addToast } = useToasts();
  const classes = useStyles();
  const dispatch = useDispatch();
  const signButtons = [
    { label: "None", value: "" },
    { label: "P", value: "P" },
    { label: "Q", value: "Q" },
    { label: "R", value: "R" },
    { label: "S", value: "S" },
    { label: "T", value: "T" },
  ];

  const handleCLickAndPress = (item: { value: string }) => {
    dispatch(
      addSign({
        index: selectedPoint?.index,
        sign: item.value,
        oldSign: selectedPoint?.sign,
      })
    );
    setSelectedPoint({ x: 0, y: 0, index: 0, sign: "" });
    setOpenPointModal(false);
    if (item.value === "") {
      addToast("Sign removed.", {
        appearance: "info",
        autoDismiss: true,
      });
    } else {
      addToast(`Sign added: '${item.value}'.`, {
        appearance: "info",
        autoDismiss: true,
      });
    }
  };

  return (
    <Dialog
      onKeyPress={(e) => {
        switch (e.key.toLowerCase()) {
          case "t":
            handleCLickAndPress({ value: "T" });
            break;
          case "p":
            handleCLickAndPress({ value: "P" });
            break;
          case "q":
            handleCLickAndPress({ value: "Q" });
            break;
          case "r":
            handleCLickAndPress({ value: "R" });
            break;
          case "s":
            handleCLickAndPress({ value: "S" });
            break;
          case "d":
            handleCLickAndPress({ value: "" });
            break;
          default:
            break;
        }
      }}
      PaperProps={{
        style: {
          padding: 10,
          border: "solid 2px grey",
          borderRadius: 40,
          textAlign: "center",
        },
      }}
      open={openPointModal}
      onClose={() => {
        setSelectedPoint({ x: 0, y: 0, index: 0, sign: "" });
        setOpenPointModal(false);
      }}
    >
      <DialogTitle disableTypography={true}>
        <Typography variant={"h3"}>Edit Point</Typography>
      </DialogTitle>
      <DialogContent>
        <Grid className={classes.modalContentStyle} container spacing={1}>
          <Grid item xs={6}>
            Time stamp(UNIX):
          </Grid>
          <Grid item xs={6}>
            {selectedPoint && selectedPoint.x ? selectedPoint.x : ""}
          </Grid>
          <Grid item xs={6}>
            uV:
          </Grid>
          <Grid item xs={6}>
            {selectedPoint && selectedPoint.y ? selectedPoint.y : ""}
          </Grid>
          <Grid item xs={3}>
            Sign:
          </Grid>
          <Grid item xs={3}>
            {selectedPoint && selectedPoint.sign ? selectedPoint.sign : ""}
          </Grid>
          <Grid item xs={3}>
            Point index:
          </Grid>
          <Grid item xs={3}>
            {selectedPoint && selectedPoint.index ? selectedPoint.index : ""}
          </Grid>
          <Grid className={classes.quickSelectSignStyle} item xs={12}>
            <ButtonGroup color="primary" fullWidth>
              {signButtons.map((item) => {
                return (
                  <Button
                    disabled={item.value === "" && selectedPoint?.sign === ""}
                    key={item.label}
                    onClick={() => handleCLickAndPress(item)}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </ButtonGroup>
          </Grid>
          <Grid className={classes.quickOptionHints} item xs={12}>
            <Typography>
              Hint: You can use keyboard buttons to mark points. Press 'd' to
              delete.
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default PointEditorDialog;
