import React from 'react';

const Icon: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={`w-6 h-6 ${className}`}
  >
    {children}
  </svg>
);

export const UserIcon: React.FC<{className?: string}> = ({className}) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </Icon>
);

export const ShoppingCartIcon: React.FC = () => (
  <Icon>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.09-.828l2.915-6.121a.75.75 0 00-.672-1.071H4.931c-.426 0-.815.31-.883.727l-.938 4.685A12.723 12.723 0 007.5 14.25z" />
  </Icon>
);

export const LogoutIcon: React.FC<{className?: string}> = ({className}) => (
  <Icon className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </Icon>
);

export const TrashIcon: React.FC = () => (
    <Icon>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.548 0A48.108 48.108 0 016.25 5.39m7.498 0a48.108 48.108 0 00-7.498-.397M1.5 4.5h21" />
    </Icon>
);

export const PlusIcon: React.FC = () => (
    <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
);

export const MinusIcon: React.FC = () => (
    <Icon className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></Icon>
);

export const SearchIcon: React.FC<{className?: string}> = ({className}) => (
    <Icon className={`w-5 h-5 ${className}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </Icon>
);

export const ChevronDownIcon: React.FC<{className?: string}> = ({className}) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </Icon>
);

export const ChevronLeftIcon: React.FC<{className?: string}> = ({className}) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </Icon>
);

export const ChevronRightIcon: React.FC<{className?: string}> = ({className}) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </Icon>
);

export const ArchiveBoxIcon: React.FC<{className?: string}> = ({className}) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.03 1.125 0 1.131.094 1.976 1.057 1.976 2.192V7.5m-9 7.5h15M3.375 9.375c.621 0 1.242 0 1.863 0L7.5 17.25h9l2.262-7.875c.621 0 1.242 0 1.863 0M5.625 18.75h12.75" />
    </Icon>
);

export const TruckIcon: React.FC<{className?: string}> = ({className}) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5h10.5a1.125 1.125 0 001.125-1.125V6.75a1.125 1.125 0 00-1.125-1.125H4.5A1.125 1.125 0 003.375 6.75v10.5a1.125 1.125 0 001.125 1.125z" />
    </Icon>
);

export const EnvelopeIcon: React.FC<{className?: string}> = ({className}) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </Icon>
);

export const Cog6ToothIcon: React.FC<{className?: string}> = ({className}) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-1.226M15.11 21.053c-1.134.116-2.292.116-3.426 0l-.09-1.298c-.134-.153-.272-.302-.414-.453l-1.05 1.003c-.64.61-1.573.833-2.446.56l-1.263-.42c-.872-.292-1.333-1.21-1.04-2.083l.42-1.263c.272-.873.05-1.806-.56-2.446l-1.003-1.05c-.15-.142-.299-.28-.452-.414l-1.298-.09c-.116-1.134-.116-2.292 0-3.426l1.298-.09c.153-.134.302-.272.453-.414l-1.003-1.05c-.61-.64-.833-1.573-.56-2.446l.42-1.263c.292-.872 1.21-1.333 2.083-1.04l1.263.42c.873.272 1.806.05 2.446-.56l1.05-1.003c.142-.15.28-.299.414-.452l.09-1.298c1.134-.116 2.292-.116 3.426 0l.09 1.298c.134.153.272.302.414.453l1.05-1.003c.64-.61 1.573-.833 2.446-.56l1.263.42c.872.292 1.333 1.21 1.04 2.083l-.42 1.263c-.272-.873-.05-1.806.56-2.446l1.003 1.05c.15.142.299.28.452.414l1.298.09c.116 1.134.116 2.292 0 3.426l-1.298.09c-.153.134-.302.272-.453-.414l1.003 1.05c.61.64.833-1.573.56-2.446l-.42-1.263c-.292-.872-1.21-1.333-2.083-1.04l-1.263-.42c-.873-.272-1.806-.05-2.446.56l-1.05 1.003c-.142.15-.28.299-.414.452l-.09 1.298zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
    </Icon>
);

export const MenuIcon: React.FC = () => (
    <Icon>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </Icon>
);

export const XIcon: React.FC<{className?: string}> = ({className}) => (
    <Icon className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </Icon>
);

export const WhatsAppIcon: React.FC<{className?: string}> = ({className}) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24"
        className={className}
    >
        <path fill="currentColor" d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.264 8.264 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.84 2.42 1.57 1.57 2.42 3.64 2.42 5.84 .02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.82s-.39-.12-.56.12c-.17.25-.64.82-.79.99-.14.17-.29.19-.54.06s-1.05-.38-2-1.23c-.74-.66-1.23-1.47-1.38-1.72s-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.42.04-.3-.02-.42c-.06-.12-.56-1.34-.76-1.84s-.4-.42-.55-.42h-.48c-.17 0-.43.06-.66.31s-.86.85-.86 2.07c0 1.22.89 2.4 1.01 2.56s1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18s.21-1.07.15-1.18c-.07-.12-.25-.2-.5-.32z"/>
    </svg>
);

export const HeartIcon: React.FC<{className?: string; filled?: boolean }> = ({ className, filled }) => {
    if (filled) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 ${className}`}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
        );
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
    );
};
