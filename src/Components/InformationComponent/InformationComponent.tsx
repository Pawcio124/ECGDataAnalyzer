import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useAppSelector } from "../../store/hooks";

const createData = (name: string, quantity: number) => {
  return { name, quantity };
};

const InformationComponent = () => {
  const information = useAppSelector((state) => state.ekgData.signQuantity);
  const rows = [
    createData("P", information.P),
    createData("Q", information.Q),
    createData("R", information.R),
    createData("S", information.S),
    createData("T", information.T),
  ];
  return (
    <Box
      marginTop={3}
      borderRadius={20}
      width={"20%"}
      border={"solid 2px grey"}
      bgcolor="background.paper"
    >
      <Box m={2} p={2} display="flex" justifyContent="center">
        <Typography variant={"h5"}>
          Number of occurrences of characters
        </Typography>
      </Box>
      <Box paddingBottom={2}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Sign</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

export default InformationComponent;
