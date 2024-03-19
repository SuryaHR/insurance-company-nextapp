import { useAppDispatch } from "@/hooks/reduxCustomHook";
import { saveComparable } from "@/reducers/_adjuster_reducers/LineItemDetail/LineItemThunkService";
import React, { useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

interface FileWithUrl extends File {
  url?: string;
  isLocal?: boolean;
}
// Define the shape of the context data using a TypeScript interface
interface LineItemContextData {
  files: FileWithUrl[];
  addFiles: (file: FileWithUrl[]) => void;
  removeFile: (name: string, clbk: () => void) => void;
  inView: boolean;
  rapidDivRef: any;
  subCategoryRef: any;
  categoryRef: any;
  rapidSubCategoryRef: any;
  rapidcategoryRef: any;
  showLoader: boolean;
  setShowLoader: React.SetStateAction<any>;
  handleItemReplace: () => void;
  itemReplaced: boolean;
  clearFile: () => void;
  setNewRetail: React.SetStateAction<any>;
  newRetail: string;
  showNewRetail: boolean;
  setShowNewRetail: React.SetStateAction<any>;
  contextSave: (payload?: { clbk?: () => void }) => void;
  giftedFrom: string;
  setGiftedFrom: React.SetStateAction<any>;
  isPageUpdated: boolean;
  setIsPageUpdated: React.SetStateAction<any>;
  isDataUpdated?: boolean;
}

// Create the context with an initial value and the TypeScript interface
export const LineItemContext = React.createContext<LineItemContextData>({
  files: [],
  addFiles: () => {},
  removeFile: () => {},
  inView: false,
  rapidDivRef: null,
  subCategoryRef: null,
  categoryRef: null,
  rapidSubCategoryRef: null,
  rapidcategoryRef: null,
  setShowLoader: () => {},
  showLoader: false,
  handleItemReplace: () => {},
  itemReplaced: false,
  clearFile: () => {},
  setNewRetail: () => {},
  newRetail: "",
  showNewRetail: false,
  setShowNewRetail: () => {},
  contextSave: () => {},
  giftedFrom: "",
  setGiftedFrom: () => {},
  isPageUpdated: false,
  setIsPageUpdated: () => {},
  isDataUpdated: false,
});

export interface IFilesProviderProps {
  children: React.ReactNode;
}

export const LineItemContextProvider: React.FC<IFilesProviderProps> = ({ children }) => {
  const [files, setFiles] = useState<FileWithUrl[]>([]);
  const subCategoryRef = useRef(null);
  const categoryRef = useRef(null);
  const rapidSubCategoryRef = useRef(null);
  const rapidcategoryRef = useRef(null);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [itemReplaced, setItemReplaced] = useState<boolean>(false);
  const [newRetail, setNewRetail] = useState("");
  const [showNewRetail, setShowNewRetail] = useState(false);
  const [giftedFrom, setGiftedFrom] = useState("");
  const [isPageUpdated, setIsPageUpdated] = useState(false);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const { ref: rapidDivRef, inView } = useInView({
    threshold: 0,
    // rootMargin: "200px",
  });

  const addFiles = (file: FileWithUrl[]) => {
    const newFile: FileWithUrl[] = [];
    for (let i = 0; i < file.length; i++) {
      file[i].url = URL.createObjectURL(file[i]);
      file[i].isLocal = true;
      newFile.push(file[i]);
    }
    setFiles((prev) => [...prev, ...newFile]);
  };

  const removeFile = (name: string, clbk: () => void) => {
    const newFile = files.filter((file) => file.name !== name);
    setFiles(newFile);
    clbk();
  };

  const clearFile = () => {
    setFiles([]);
  };

  const timeout = useRef<ReturnType<typeof setInterval> | null>(null);
  const handleItemReplace = () => {
    if (timeout.current) {
      clearTimeout(timeout?.current);
    }
    setItemReplaced(true);
    timeout.current = setTimeout(() => {
      setItemReplaced(false);
    }, 200);
  };

  const handleDataSaveUpdate = () => {
    if (timeout.current) {
      clearTimeout(timeout?.current);
    }
    setIsDataUpdated(true);
    timeout.current = setTimeout(() => {
      setIsDataUpdated(false);
    }, 200);
  };

  const dispatch = useAppDispatch();
  const contextSave = (payload?: { clbk?: () => void }) => {
    setShowLoader(true);
    dispatch(
      saveComparable({
        attachmentList: files,
        customRetailer: newRetail ? { name: newRetail } : null,
        callback: () => {
          setShowLoader(false);
          clearFile();
          setNewRetail("");
          setShowNewRetail(false);
          setIsPageUpdated(false);
          handleDataSaveUpdate();
          payload?.clbk && payload?.clbk();
        },
      })
    );
  };

  return (
    <LineItemContext.Provider
      value={{
        addFiles,
        files,
        removeFile,
        inView,
        rapidDivRef,
        subCategoryRef,
        categoryRef,
        rapidSubCategoryRef,
        rapidcategoryRef,
        setShowLoader,
        showLoader,
        handleItemReplace,
        itemReplaced,
        clearFile,
        setNewRetail,
        newRetail,
        showNewRetail,
        setShowNewRetail,
        contextSave,
        giftedFrom,
        setGiftedFrom,
        isPageUpdated,
        setIsPageUpdated,
        isDataUpdated,
      }}
    >
      {children}
    </LineItemContext.Provider>
  );
};
