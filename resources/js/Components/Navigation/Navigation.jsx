import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline/index.js';
import React, { Fragment } from 'react';
import Search from '@/Components/Search/Search.jsx';
import clsx from 'clsx';
import { useAuth } from '@/Hooks/useAuth/useAuth.jsx';
import { Button, Dropdown } from 'flowbite-react';

export function Navigation() {
    const { pendingCheck, isLoggedIn, user, logout } = useAuth();
    const navigation = [
        { name: 'Authors', href: '#', current: false, disabled: true, visible: false },
        { name: 'Works', href: '#', current: false, disabled: true, visible: false },
        { name: 'Groups', href: route('Groups.Page'), current: window.location.href === route('Groups.Page'), disabled: false, visible: true },
    ];

    const logo = (
        <div className="flex-shrink-0">
            <a className={styles.logo} href={route('Home.Page')}>
                MyPubsV2
            </a>
        </div>
    );

    const searchVisible = window.location.href.replace(/\/+$/, '') !== route('Home.Page');

    return (
        <Disclosure as="nav" className={styles.disclosure}>
            {({ open }) => (
                <>
                    <div className="border-b border-b-gray-300 bg-gray-50 px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 items-center justify-between">
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    {logo}
                                    {navigation.map(
                                        (item) =>
                                            !item.disabled &&
                                            item.visible && (
                                                <a
                                                    key={item.name}
                                                    href={item.href}
                                                    aria-current={item.current ? 'page' : undefined}
                                                    className={clsx(styles.groupItem, item.current ? styles.activeGroupItem : styles.inactiveGroupItem)}
                                                >
                                                    {item.name}
                                                </a>
                                            ),
                                    )}
                                </div>
                            </div>
                            <div className={'md:hidden'}>
                                <div className="flex items-center px-2">
                                    {logo}
                                    <button type="button" className={styles.notificationsButton}>
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">View notifications</span>
                                        <BellIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                            <div className="ml-auto hidden md:block">
                                <div className={'flex gap-5'}>
                                    {pendingCheck ? (
                                        <div role="status" className="flex animate-pulse items-center justify-center align-middle">
                                            <div className="me-3 h-2.5 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                            <svg className="h-8 w-8 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <>
                                            <>{searchVisible && <Search />}</>
                                            {isLoggedIn && user ? (
                                                <Dropdown
                                                    label=""
                                                    dismissOnClick={false}
                                                    renderTrigger={() => <span className={'align-items-center my-auto cursor-pointer text-center'}>{user?.displayName}</span>}
                                                >
                                                    {user.profileUrl && (
                                                        <Dropdown.Item>
                                                            <a href={user.profileUrl} className={'align-items-center my-auto text-center'}>
                                                                My Profile
                                                            </a>
                                                        </Dropdown.Item>
                                                    )}
                                                    <Dropdown.Item onClick={() => logout()}>Logout</Dropdown.Item>
                                                </Dropdown>
                                            ) : (
                                                <a href={route('Auth.Login')} className={'align-items-center my-auto text-center'}>
                                                    Login
                                                </a>
                                            )}
                                        </>
                                    )}
                                </div>
                                <Menu as="div" className="relative ml-3">
                                    <Menu.Button className={styles.menuButton}>
                                        <span className="absolute -inset-1.5" />
                                        <span className="sr-only">Open user menu</span>
                                    </Menu.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className={styles.menuItemsList}>
                                            <Menu.Item>
                                                <Button size={'sm'} color={'gray'}>
                                                    Logout
                                                </Button>
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                            <div className="-mr-2 flex md:hidden">
                                {searchVisible && <Search />}
                                <Disclosure.Button className={styles.disclosureButton}>
                                    <span className="absolute -inset-0.5" />
                                    <span className="sr-only">Open main menu</span>
                                    {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
                                </Disclosure.Button>
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="md:hidden">
                        <div className={styles.navigationWrapper}>
                            {navigation.map(
                                (item) =>
                                    !item.disabled && (
                                        <Disclosure.Button
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            aria-current={item.current ? 'page' : undefined}
                                            disabled={item.disabled}
                                            className={clsx(styles.groupItem, item.current ? styles.activeGroupItem : styles.inactiveGroupItem)}
                                        >
                                            {item.name}
                                        </Disclosure.Button>
                                    ),
                            )}
                        </div>
                        <div className="border-t border-gray-700 pb-3 pt-2">
                            <div className="mt-2 space-y-1 px-2">
                                <div className="ml-3">
                                    {isLoggedIn ? (
                                        <span className={'align-items-center my-auto text-center'}>{user.displayName}</span>
                                    ) : (
                                        <a href={route('Auth.Login')} className={'align-items-center my-auto text-center'}>
                                            Login
                                        </a>
                                    )}
                                </div>
                                {isLoggedIn && (
                                    <Disclosure.Button
                                        key={'logout'}
                                        as="button"
                                        onClick={() => logout()}
                                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                    >
                                        Logout
                                    </Disclosure.Button>
                                )}
                            </div>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}

const styles = {
    logo: 'text-black mr-4 sm:text-xl md:text-2xl',
    disabledLink: 'opacity-50 cursor-default',
    disclosure: 'bg-background border-b border-b-gray-100 sticky top-0 z-40',
    activeGroupItem: 'bg-gray-500 text-white',
    inactiveGroupItem: 'text-black hover:bg-gray-400 hover:text-white',
    groupItem: 'block rounded-md px-3 py-2 text-base font-medium',
    disclosureButton:
        'ml-3 relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400' +
        ' hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800',
    navigationWrapper: 'space-y-1 px-2 pb-3 pt-2 sm:px-3',
    notificationsButton:
        'relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-black focus:outline-none ' + 'focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800',
    menuItemsList: 'absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
    menuButton: 'relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800',
};
