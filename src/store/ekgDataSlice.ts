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
  navigateByR: boolean;
  ekg: any[];
  loaded: boolean;
  signQuantity: { P: number; Q: number; R: number; S: number; T: number };
  ekgDataInfo: {
    calculateSignsPTDone: boolean;
    calculateSignsQSDone: boolean;
    PIndex: number[];
    QIndex: number[];
    RIndex: number[];
    SIndex: number[];
    TIndex: number[];
  };
}

const initialState: ekgDataSliceProps = {
  navigateByR: false,
  ekg: [],
  signQuantity: { P: 0, Q: 0, R: 0, S: 0, T: 0 },
  loaded: false,
  ekgDataInfo: {
    calculateSignsPTDone: false,
    calculateSignsQSDone: false,
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
    setNavigateByR: (state) => {
      state.navigateByR = !state.navigateByR;
    },
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
      state.navigateByR = false;
      state.ekg = [];
      state.signQuantity = { P: 0, Q: 0, R: 0, S: 0, T: 0 };
      state.loaded = false;
      state.ekgDataInfo = {
        calculateSignsPTDone: false,
        calculateSignsQSDone: false,
        PIndex: [],
        QIndex: [],
        RIndex: [],
        SIndex: [],
        TIndex: [],
      };
    },
    calculateSignsQS: (state) => {
      let findS = false;
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
          if (
            parseInt(state.ekg[j][1]) < parseInt(state.ekg[j + 1][1]) &&
            state.ekgDataInfo.RIndex[i + 1] - j <= 5 &&
            findS &&
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
        findQ = false;
      }
      state.ekgDataInfo.calculateSignsQSDone = true;
    },
    calculateSignsPT: (state) => {
      for (let i = 0; i < state.ekgDataInfo.QIndex.length; i++) {
        const QIndex = state.ekgDataInfo.QIndex[i];
        const valueArray: number[] = [];
        for (let j = 25; j > 0; j--) {
          valueArray.push(parseInt(state.ekg[QIndex - j][1]));
        }
        const maxValueIndex = valueArray.indexOf(Math.max(...valueArray));
        if (maxValueIndex !== -1) {
          const foundPIndex = QIndex - (valueArray.length - maxValueIndex);
          editQuantity(state.signQuantity, "P", 1);
          state.ekgDataInfo.PIndex.push(foundPIndex);
          state.ekg.splice(foundPIndex, 1, [
            state.ekg[foundPIndex][0],
            state.ekg[foundPIndex][1],
            "P",
          ]);
        }
      }
      for (let i = 0; i < state.ekgDataInfo.SIndex.length; i++) {
        const SIndex = state.ekgDataInfo.SIndex[i];
        const valueArray: number[] = [];
        for (let j = 6; j < 40; j++) {
          valueArray.push(parseInt(state.ekg[SIndex + j][1]));
        }
        const maxValueIndex = valueArray.indexOf(Math.max(...valueArray));
        if (maxValueIndex !== -1) {
          const foundPIndex = SIndex + maxValueIndex + 6;
          editQuantity(state.signQuantity, "T", 1);
          state.ekgDataInfo.TIndex.push(foundPIndex);
          state.ekg.splice(foundPIndex, 1, [
            state.ekg[foundPIndex][0],
            state.ekg[foundPIndex][1],
            "T",
          ]);
        }
      }
      state.ekgDataInfo.calculateSignsPTDone = true;
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
  setNavigateByR,
  saveEkgData,
  clearEkgData,
  addSign,
  calculateSignsQS,
  calculateSignsPT,
} = ekgDataSlice.actions;

export default ekgDataSlice.reducer;
