
import { Fragment } from "react";
import {Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24';



export type HandleLoadExample = (index: number) => void;
export type HandleFileUpload = (file: File) => void;

interface MyDropdownProps {
    handleLoadExample: HandleLoadExample;
    handleFileUpload: HandleFileUpload;
}

// Dropdown component
function myDropDown({ handleLoadExample, handleFileUpload}: MyDropdownProps) {
    // Read file
    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            handleFileUpload(event.target.files[0]);
        }
    }
}
