import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notes: [],
  notesParticipants: [],
  notesFull: [],
  searchKey: "",
};

const AllNotesSlice = createSlice({
  initialState,
  name: "allNotes",
  reducers: {
    addNotes(state, action) {
      const { payload } = action;
      const { notes } = payload;
      state.notes = notes;
    },
    addNotesParticipants(state, action) {
      const { payload } = action;
      const { notesParticipants } = payload;
      state.notesParticipants = notesParticipants;
    },
    addNotesFull(state, action) {
      const { payload } = action;
      const { notesFull } = payload;
      state.notesFull = notesFull;
    },
    addSearchKey(state, action) {
      const { payload } = action;
      const { searchKey } = payload;
      state.searchKey = searchKey;
    },
  },
});
export default AllNotesSlice;

export const { addNotes, addNotesParticipants, addNotesFull, addSearchKey } =
  AllNotesSlice.actions;
