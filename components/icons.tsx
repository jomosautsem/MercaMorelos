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

export const SearchIcon: React.FC = () => (
    <Icon className="w-5 h-5 text-on-surface-secondary">
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-1.226M15.11 21.053c-1.134.116-2.292.116-3.426 0l-.09-1.298c-.134-.153-.272-.302-.414-.453l-1.05 1.003c-.64.61-1.573.833-2.446.56l-1.263-.42c-.872-.292-1.333-1.21-1.04-2.083l.42-1.263c.272-.873.05-1.806-.56-2.446l-1.003-1.05c-.15-.142-.299-.28-.452-.414l-1.298-.09c-.116-1.134-.116-2.292 0-3.426l1.298-.09c.153-.134.302-.272.453-.414l-1.003-1.05c-.61-.64-.833-1.573-.56-2.446l.42-1.263c.292-.872 1.21-1.333 2.083-1.04l1.263.42c.873.272 1.806.05 2.446-.56l1.05-1.003c.142-.15.28-.299.414-.452l.09-1.298c1.134-.116 2.292-.116 3.426 0l.09 1.298c.134.153.272.302.414.453l1.05-1.003c.64-.61 1.573-.833 2.446-.56l1.263.42c.872.292 1.333 1.21 1.04 2.083l-.42 1.263c-.272.873-.05 1.806.56 2.446l1.003 1.05c.15.142.299.28.452.414l1.298.09c.116 1.134.116 2.292 0 3.426l-1.298.09c-.153.134-.302.272-.453.414l1.003 1.05c.61.64.833 1.573.56 2.446l-.42 1.263c-.292-.872-1.21-1.333-2.083-1.04l-1.263-.42c-.873-.272-1.806-.05-2.446.56l-1.05 1.003c-.142.15-.28.299-.414.452l-.09 1.298zM12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
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
