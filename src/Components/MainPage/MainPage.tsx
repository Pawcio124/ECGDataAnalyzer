import NavBar from "../NavBar/NavBar";
import { Box } from "@material-ui/core";
import EKGPlotComponent from "../EKGPlotComponent/EKGPlotComponent";
import InformationComponent from "../InformationComponent/InformationComponent";
import { useAppSelector } from "../../store/hooks";

const MainPage = () => {
  const showInfo = useAppSelector((state) => state.ekgData.loaded);
  return (
    <Box m={1} p={1}>
      <NavBar />
      <Box
        marginTop={2}
        borderRadius={20}
        padding={5}
        border={"solid 2px grey"}
        bgcolor="background.paper"
      >
        <EKGPlotComponent />
      </Box>
      {showInfo ? <InformationComponent /> : null}
    </Box>
  );
};

export default MainPage;
