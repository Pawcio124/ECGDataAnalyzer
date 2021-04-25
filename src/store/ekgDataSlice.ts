import { createSlice } from "@reduxjs/toolkit";

const editQuantity = (
  state: { P: number; Q: number; R: number; S: number; T: number },
  sign: string,
  numberOperation: number
) => {
  switch (sign) {
    case "P":
      state.P = state.P + numberOperation;
      break;
    case "Q":
      state.Q = state.Q + numberOperation;
      break;
    case "R":
      state.R = state.R + numberOperation;
      break;
    case "S":
      state.S = state.S + numberOperation;
      break;
    case "T":
      state.T = state.T + numberOperation;
      break;
    default:
      break;
  }
};

interface ekgDataSliceProps {
  ekg: any[];
  loaded: boolean;
  signQuantity: { P: number; Q: number; R: number; S: number; T: number };
}

const initialState: ekgDataSliceProps = {
  ekg: [],
  signQuantity: { P: 0, Q: 0, R: 0, S: 0, T: 0 },
  loaded: false,
};
export const ekgDataSlice = createSlice({
  name: "ekgData",
  initialState,
  reducers: {
    saveEkgData: (state, payload) => {
      payload.payload.forEach(({ data }: any) => {
        if (data[2]) {
          editQuantity(state.signQuantity, data[2], 1);
        }
        state.ekg.push([data[0], data[1], data[2] ?? ""]);
      });
      state.loaded = true;
    },
    clearEkgData: (state) => {
      state.ekg = [];
      state.signQuantity = { P: 0, Q: 0, R: 0, S: 0, T: 0 };
      state.loaded = false;
    },
    addSign: (state, payload) => {
      const { index, sign, oldSign } = payload.payload;
      editQuantity(state.signQuantity, sign, 1);
      editQuantity(state.signQuantity, oldSign, -1);
      state.ekg.splice(index, 1, [
        state.ekg[index][0],
        state.ekg[index][1],
        sign ?? "",
      ]);
    },
  },
});

export const { saveEkgData, clearEkgData, addSign } = ekgDataSlice.actions;

export default ekgDataSlice.reducer;
