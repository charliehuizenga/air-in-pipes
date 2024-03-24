import { Dispatch, SetStateAction } from "react";

export type HandleLoadExample = (index: number) => void;
export type HandleFileUpload = (file: File) => void;

// Props for the dropdown component
export interface MyDropdownProps {
    handleLoadExample: HandleLoadExample;
    handleFileUpload: HandleFileUpload;
}

