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
  ekgDataInfo: {
    PIndex: number[];
    QIndex: number[];
    RIndex: number[];
    SIndex: number[];
    TIndex: number[];
  };
}

const initialState: ekgDataSliceProps = {
  ekg: [],
  signQuantity: { P: 0, Q: 0, R: 0, S: 0, T: 0 },
  loaded: false,
  ekgDataInfo: {
    PIndex: [],
    QIndex: [],
    RIndex: [],
    SIndex: [],
    TIndex: [],
  },
};
export const ekgDataSlice = createSlice({
  name: "ekgData",
  initialState,
  reducers: {
    saveEkgData: (state, payload) => {
      payload.payload.forEach(({ data }: any, index: number) => {
        if (data[2]) {
          editQuantity(state.signQuantity, data[2], 1);
          if (data[2] === "R") {
            state.ekgDataInfo.RIndex.push(index);
          }
        }
        state.ekg.push([data[0], data[1], data[2] ?? ""]);
      });
      state.loaded = true;
    },
    clearEkgData: (state) => {
      state.ekg = [];
      state.signQuantity = { P: 0, Q: 0, R: 0, S: 0, T: 0 };
      state.loaded = false;
      state.ekgDataInfo = {
        PIndex: [],
        QIndex: [],
        RIndex: [],
        SIndex: [],
        TIndex: [],
      };
    },
    calculateSigns: (state, payload) => {
      let findS = false;
      let findT = false;
      let findP = false;
      let findQ = false;
      for (let i = 0; i < state.ekgDataInfo.RIndex.length; i++) {
        for (
          let j = state.ekgDataInfo.RIndex[i] + 1;
          j < state.ekgDataInfo.RIndex[i + 1];
          j++
        ) {
          if (
            parseInt(state.ekg[j][1]) < parseInt(state.ekg[j + 1][1]) &&
            !findS
          ) {
            findS = true;
            editQuantity(state.signQuantity, "S", 1);
            state.ekgDataInfo.SIndex.push(j);
            state.ekg.splice(j, 1, [state.ekg[j][0], state.ekg[j][1], "S"]);
          }
          const tJump = 16;
          if (
            parseInt(state.ekg[j + tJump][1]) >
              parseInt(state.ekg[j + tJump + 1][1]) &&
            !findT &&
            j + tJump < state.ekgDataInfo.RIndex[i + 1] &&
            findS
          ) {
            findT = true;
            if (payload.payload.T) {
              editQuantity(state.signQuantity, "T", 1);
              state.ekgDataInfo.TIndex.push(j + tJump);
              state.ekg.splice(j + tJump, 1, [
                state.ekg[j + tJump][0],
                state.ekg[j + tJump][1],
                "T",
              ]);
            }
          }
          const PJump = 48;
          if (
            state.ekg[j + PJump] &&
            state.ekg[j + PJump + 1] &&
            parseInt(state.ekg[j + PJump][1]) >
              parseInt(state.ekg[j + PJump + 1][1]) &&
            j + PJump < state.ekgDataInfo.RIndex[i + 1] &&
            findT &&
            findS &&
            !findP
          ) {
            findP = true;
            if (payload.payload.P) {
              editQuantity(state.signQuantity, "P", 1);
              state.ekgDataInfo.PIndex.push(j + PJump);
              state.ekg.splice(j + PJump, 1, [
                state.ekg[j + PJump][0],
                state.ekg[j + PJump][1],
                "P",
              ]);
            }
          }
          if (
            parseInt(state.ekg[j][1]) < parseInt(state.ekg[j + 1][1]) &&
            state.ekgDataInfo.RIndex[i + 1] - j <= 5 &&
            findT &&
            findS &&
            findP &&
            !findQ
          ) {
            findQ = true;
            editQuantity(state.signQuantity, "Q", 1);
            state.ekgDataInfo.QIndex.push(j);
            state.ekg.splice(j, 1, [state.ekg[j][0], state.ekg[j][1], "Q"]);
            break;
          }
        }
        findS = false;
        findT = false;
        findP = false;
        findQ = false;
      }
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

export const {
  saveEkgData,
  clearEkgData,
  addSign,
  calculateSigns,
} = ekgDataSlice.actions;

export default ekgDataSlice.reducer;
