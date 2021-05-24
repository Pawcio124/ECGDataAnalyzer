import NavBar from "../NavBar/NavBar";
import { Box } from "@material-ui/core";
import EKGPlotComponent from "../EKGPlotComponent/EKGPlotComponent";
import InformationComponent from "../InformationComponent/InformationComponent";
import { useAppSelector } from "../../store/hooks";
import { useState } from "react";

const MainPage = () => {
  const showInfo = useAppSelector((state) => state.ekgData.loaded);
  const [counter, setCounter] = useState(1);
  return (
    <Box
      tabIndex={0}
      onKeyDown={(e) => {
        if (showInfo) {
          switch (e.key) {
            case "ArrowLeft":
              e.preventDefault();
              if (counter !== 1) setCounter((oldValue) => oldValue - 1);
              break;
            case "ArrowRight":
              e.preventDefault();
              setCounter((oldValue) => oldValue + 1);
              break;
            default:
              break;
          }
        }
      }}
      m={1}
      p={1}
    >
      <NavBar />
      <Box
        marginTop={2}
        borderRadius={20}
        padding={5}
        border={"solid 2px grey"}
        bgcolor="background.paper"
      >
        <EKGPlotComponent counter={counter} setCounter={setCounter} />
      </Box>
      {showInfo ? <InformationComponent /> : null}
    </Box>
  );
};

export default MainPage;
