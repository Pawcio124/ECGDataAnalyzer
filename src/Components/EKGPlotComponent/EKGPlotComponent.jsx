import Plot from "../../../node_modules/react-plotly.js/react-plotly";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  ArrowBackIos,
  ArrowForwardIos,
  FirstPage,
  LastPage,
} from "@material-ui/icons";
import { Box, IconButton, makeStyles, Typography } from "@material-ui/core";
import PointEditorDialog from "./PointEditorDialog";
import useWindowDimensions from "../../store/customHooks/useWindowDimension";

const useStyles = makeStyles({
  buttonStyle: {
    "&:hover, &:focus": {
      background: "none",
    },
  },
});

const EKGPlotComponent = ({ counter, setCounter }) => {
  const classes = useStyles();
  const [openPointModal, setOpenPointModal] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState();
  const ekgDataPlot = useSelector((state) => state.ekgData.ekg);
  const lengthOfR = useSelector((state) => state.ekgData.signQuantity.R);
  const indexR = useSelector((state) => state.ekgData.ekgDataInfo.RIndex);
  const { height, width } = useWindowDimensions();
  const [xAxisData, setXAxisData] = useState([]);
  const [yAxisData, setYAxisData] = useState([]);
  const [textData, setTextData] = useState([]);
  const [annotation, setAnnotation] = useState([]);

  useEffect(() => {
    if (ekgDataPlot.length) {
      let stepValue;
      if (counter === 1) stepValue = [0, indexR[counter]];
      else stepValue = [indexR[counter - 1], indexR[counter + 1]];
      const annotations = [];
      setXAxisData(
        ekgDataPlot.slice(stepValue[0], stepValue[1]).map((item) => item[0])
      );
      setYAxisData(
        ekgDataPlot.slice(stepValue[0], stepValue[1]).map((item) => item[1])
      );
      setTextData(
        ekgDataPlot.slice(stepValue[0], stepValue[1]).map((item) => item[2])
      );
      ekgDataPlot.slice(stepValue[0], stepValue[1]).forEach((item) => {
        if (item[2]) {
          annotations.push({
            x: item[0],
            y: item[1],
            xref: "x",
            yref: "y",
            text: item[2],
            showarrow: true,
            arrowhead: 3,
            ax: 0,
            ay: item[2] === "Q" || item[2] === "S" ? 40 : -40,
          });
        }
      });
      setAnnotation(annotations);
    }
  }, [ekgDataPlot, counter, indexR]);

  return (
    <>
      `
      <Box display="flex" justifyContent="center">
        {!ekgDataPlot.length ? (
          <Typography variant={"h2"}>No data to show</Typography>
        ) : (
          <Box display="flex" alignItems="center">
            <IconButton
              disabled={counter === 1}
              onClick={() => {
                setCounter(1);
              }}
              className={classes.buttonStyle}
            >
              <FirstPage fontSize="large" />
            </IconButton>
            <IconButton
              disabled={counter === 1}
              onClick={() => {
                setCounter((oldValue) => oldValue - 1);
              }}
              className={classes.buttonStyle}
            >
              <ArrowBackIos fontSize="large" />
            </IconButton>
            <Plot
              data={[
                {
                  x: xAxisData,
                  y: yAxisData,
                  text: textData,
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "red" },
                },
              ]}
              layout={{
                annotations: annotation,
                height: height * 0.75,
                width: width * 0.75,
                title: `ECG (${counter}/${lengthOfR})`,
              }}
              onClick={(e) => {
                setOpenPointModal(true);
                setSelectedPoint({
                  x: e.points[0].x,
                  y: e.points[0].y,
                  index:
                    e.points[0].pointIndex +
                    (counter === 1 ? 0 : indexR[counter - 1]),
                  sign: e.points[0].text ?? "",
                });
              }}
            />
            <IconButton
              disabled={counter === lengthOfR}
              onClick={() => {
                setCounter((oldValue) => oldValue + 1);
              }}
              className={classes.buttonStyle}
            >
              <ArrowForwardIos fontSize="large" />
            </IconButton>
            <IconButton
              disabled={counter === lengthOfR}
              onClick={() => {
                setCounter(lengthOfR);
              }}
              className={classes.buttonStyle}
            >
              <LastPage fontSize="large" />
            </IconButton>
          </Box>
        )}
      </Box>
      <PointEditorDialog
        setSelectedPoint={setSelectedPoint}
        openPointModal={openPointModal}
        setOpenPointModal={setOpenPointModal}
        selectedPoint={selectedPoint}
      />
    </>
  );
};

export default EKGPlotComponent;
