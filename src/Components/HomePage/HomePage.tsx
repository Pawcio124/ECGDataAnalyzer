import { Box, IconButton, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Input } from "@material-ui/icons";

const useStyles = makeStyles({
  textStyle: {
    color: "white",
    userSelect: "none",
  },
  welcomeTextStyle: {
    color: "white",
    fontSize: 130,
    fontFamily: "Indie Flower",
    userSelect: "none",
  },
  buttonStyle: {
    color: "white",
    fontSize: 120,
  },
  welcomeBoxStyle: {
    position: "absolute",
    width: "auto",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  },
  textBoxStyle: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    padding: "85px",
  },
});

const HomePage = () => {
  const classes = useStyles();
  let history = useHistory();

  const handleClick = () => {
    history.push("/ekgAnalyser");
  };

  return (
    <Box className={classes.welcomeBoxStyle}>
      <Box className={classes.textBoxStyle}>
        <Box textAlign={"center"}>
          <Typography className={classes.textStyle} variant={"h2"}>
            Welcome!
          </Typography>
          <Typography className={classes.welcomeTextStyle}>
            ECG Data Selector
          </Typography>
          <IconButton onClick={handleClick}>
            <Input className={classes.buttonStyle} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
