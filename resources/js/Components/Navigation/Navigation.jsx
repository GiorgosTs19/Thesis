import { Disclosure } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline/index.js';
import React, { Fragment } from 'react';
import Search from '@/Components/Search/Search.jsx';
import clsx from 'clsx';

export function Navigation() {
    // const user = {
    //     name: 'Tom Cook',
    //     email: 'tom@example.com',
    //     imageUrl:
    //         'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    // };

    const navigation = [
        { name: 'Authors', href: '#', current: false, disabled: true },
        { name: 'Works', href: '#', current: false, disabled: true },
        { name: 'Groups', href: route('Groups.Page'), current: window.location.href === route('Groups.Page'), disabled: false },
    ];

    // const userNavigation = [
    //     { name: 'Your Profile', href: '#' },
    //     { name: 'Settings', href: '#' },
    //     { name: 'Sign out', href: '#' },
    // ];

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
                            <div className="flex items-center">
                                <div className="hidden md:block">
                                    <div className="ml-10 flex items-baseline space-x-4">
                                        {logo}
                                        {navigation.map(
                                            (item) =>
                                                !item.disabled && (
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
                                    <div className="flex items-center bg-white px-2 ">
                                        {logo}
                                        <button type="button" className={styles.notificationsButton}>
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">View notifications</span>
                                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-4 flex items-center md:ml-6">
                                    <div className={'flex gap-5'}>
                                        {searchVisible && <Search />}
                                        <a href={route('Auth.Login')}>Login</a>
                                        {/*<button type="button" className={styles.notificationsButton}>*/}
                                        {/*    <span className="absolute -inset-1.5"/>*/}
                                        {/*    <span className="sr-only">View notifications</span>*/}
                                        {/*    <BellIcon className="h-6 w-6" aria-hidden="true"/>*/}
                                        {/*</button>*/}
                                    </div>
                                    {/*<Menu as="div" className="relative ml-3">*/}
                                    {/*    <Menu.Button*/}
                                    {/*        className={styles.menuButton}>*/}
                                    {/*        <span className="absolute -inset-1.5"/>*/}
                                    {/*        <span className="sr-only">Open user menu</span>*/}
                                    {/*        <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt=""/>*/}
                                    {/*    </Menu.Button>*/}
                                    {/*    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"*/}
                                    {/*                leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">*/}
                                    {/*        <Menu.Items*/}
                                    {/*            className={styles.menuItemsList}>*/}
                                    {/*            {userNavigation.map((item) => (*/}
                                    {/*                <Menu.Item key={item.name}>*/}
                                    {/*                    {({active}) => (*/}
                                    {/*                        <a href={item.href} className={clsx(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}>*/}
                                    {/*                            {item.name}*/}
                                    {/*                        </a>*/}
                                    {/*                    )}*/}
                                    {/*                </Menu.Item>*/}
                                    {/*            ))}*/}
                                    {/*        </Menu.Items>*/}
                                    {/*    </Transition>*/}
                                    {/*</Menu>*/}
                                </div>
                            </div>
                            <div className="-mr-2 flex w-full md:hidden">
                                <Search />
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
                        {/*<div className="border-t border-gray-700 pb-3 pt-2">*/}
                        {/*    <div className="mt-2 space-y-1 px-2">*/}
                        {/*        <div className="ml-3">*/}
                        {/*            <div*/}
                        {/*                className="text-base font-medium leading-none text-white">{user.name}</div>*/}
                        {/*            <div*/}
                        {/*                className="text-sm font-medium leading-none text-gray-400">{user.email}</div>*/}
                        {/*        </div>*/}
                        {/*        {userNavigation.map((item) => (*/}
                        {/*            <Disclosure.Button key={item.name} as="a" href={item.href}*/}
                        {/*                               className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">*/}
                        {/*                {item.name}*/}
                        {/*            </Disclosure.Button>*/}
                        {/*        ))}*/}
                        {/*    </div>*/}
                        {/*</div>*/}
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
