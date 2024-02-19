import React, {createContext, useContext, useState} from 'react';
import {arrayOf, node, oneOfType} from "prop-types";
import {Toast} from "flowbite-react";
import {HiCheck, HiExclamation, HiX} from "react-icons/hi";
import {FaExclamation} from "react-icons/fa";
import clsx from "clsx";

export const ToastTypes = {
    ERROR: 'ERROR',
    INFO: 'INFO',
    WARNING: 'WARNING',
    SUCCESS: 'SUCCESS'
}

const ToastIconClassName = {
    ERROR: 'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200',
    INFO: 'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-200 text-blue-500 dark:bg-blue-800 dark:text-blue-200',
    WARNING: 'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200',
    SUCCESS: 'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200'
}

const ToastIcons = {
    ERROR: <div className={ToastIconClassName.ERROR}>
        <HiX className="h-5 w-5"/>
    </div>,
    SUCCESS: <div className={ToastIconClassName.SUCCESS}>
        <HiCheck className="h-5 w-5"/>
    </div>,
    WARNING: <div className={ToastIconClassName.WARNING}>
        <HiExclamation className="h-5 w-5"/>
    </div>,
    INFO: <div className={ToastIconClassName.INFO}>
        <FaExclamation className="h-5 w-5"/>
    </div>
}

const ToastContext = createContext(null);
export const ToastProvider = ({children}) => {
    const [toastState, setToastState] = useState({
        visible: false,
        message: null,
        type: ToastTypes.INFO,
        icon: ToastIcons.INFO,
        className: null,
        title: null
    });
    console.log(toastState)
    const showToast = (message, type = ToastTypes.INFO, title = null, duration = 55000) => {
        let icon;
        let className;
        switch (type) {
            case ToastTypes.ERROR : {
                icon = ToastIcons.ERROR
                className = 'bg-red-600 text-black';
                break;
            }
            case ToastTypes.WARNING : {
                icon = ToastIcons.WARNING
                className = 'bg-yellow-500 text-black';
                break;
            }
            case ToastTypes.SUCCESS : {
                icon = ToastIcons.SUCCESS
                className = 'bg-green-500 text-black';
                break;
            }
            case ToastTypes.INFO : {
                icon = ToastIcons.INFO;
                className = 'bg-blue-400 text-black';
                break;
            }
            default : {
                icon = ToastIcons.INFO;
                className = 'bg-blue-400 text-black';
                break;
            }
        }

        setToastState({
            visible: true,
            message,
            type,
            icon,
            className,
            title
        });

        setTimeout(() => {
            hideToast();
        }, duration);
    };

    const hideToast = () => {
        setToastState({
            visible: false,
            message: '',
            type: ToastTypes.INFO,
            icon: ToastIcons.INFO
        });
    };


    const contextValue = {
        showToast,
        hideToast,
        toastState,
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {toastState.visible && <Toast className={clsx('toast flex', toastState.className)}>
                {toastState.icon}
                <div className={'flex flex-col gap-2 text-center text-sm'}>
                    {toastState.title}
                    <div className="ml-3 font-normal text-base text-black text-left">{toastState.message}</div>
                </div>
                <Toast.Toggle onDismiss={hideToast} className={toastState.className}/>
            </Toast>}
            {children}
        </ToastContext.Provider>
    );
};

ToastProvider.propTypes = {
    children: oneOfType([node, arrayOf(node)]).isRequired
}

export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return context;
};
