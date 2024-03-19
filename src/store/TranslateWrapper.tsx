"use client";
import CustomLoader from "@/components/common/CustomLoader";
import { unknownObjectType } from "@/constants/customTypes";
import React, { useContext, useEffect, useState } from "react";

export type TranslateContextData<T> = {
  translate: T;
  storingTranslation: boolean;
  setTranslation: React.SetStateAction<any>;
};

interface TranslateProviderProps {
  children: React.ReactNode;
}

export const TranslateContext = React.createContext<TranslateContextData<any>>({
  translate: {},
  setTranslation: () => {},
  storingTranslation: true,
});

export const TranslateContextProvider: React.FC<TranslateProviderProps> = ({
  children,
}) => {
  const [translate, setTranslation] = useState<any>({});
  const [storingTranslation, setStoringTranslation] = useState(true);

  useEffect(() => {
    if (Object.keys(translate).length) {
      setStoringTranslation(false);
    }
    return () => {
      setStoringTranslation(true);
    };
  }, [translate]);

  return (
    <TranslateContext.Provider value={{ translate, setTranslation, storingTranslation }}>
      {children}
    </TranslateContext.Provider>
  );
};

// wrapper component
type WrapperProps = {
  translate: object;
  children: React.ReactNode;
};

const WrapperComponent = ({
  children,
  translate,
}: {
  children: React.ReactNode;
  translate: unknownObjectType;
}) => {
  const { setTranslation, storingTranslation } = useContext(TranslateContext);

  useEffect(() => {
    setTranslation(translate);
  }, [translate, setTranslation]);

  if (storingTranslation) {
    return <CustomLoader />;
  }

  return <>{children}</>;
};

const TranslateWrapper = ({ translate, children }: WrapperProps) => {
  return (
    <TranslateContextProvider>
      <WrapperComponent translate={translate}>{children}</WrapperComponent>
    </TranslateContextProvider>
  );
};

export default TranslateWrapper;
