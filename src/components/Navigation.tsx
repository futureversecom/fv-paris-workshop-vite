/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from './ui/navigation-menu';

import { type Dispatch, type SetStateAction, useState } from 'react';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <InnerNavigation
        classes="hidden lg:flex flex-row"
        closeHandler={setIsMenuOpen}
      />
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-white hover:text-orange-500 duration-300 transition-colors flex lg:hidden border-orange-500 border-[1px] rounded-md p-2 uppercase text-xs tracking-wider"
      >
        Menu
      </button>
      {isMenuOpen && (
        <div className="absolute -right-4 -bottom-6 translate-y-full bg-slate-500 bg-opacity-90 rounded-md p-2 pl-1.5 items-end">
          <InnerNavigation
            classes="flex lg:hidden flex-col text-end items-end"
            closeHandler={setIsMenuOpen}
          />
        </div>
      )}
    </div>
  );
}

const InnerNavigation = ({
  classes = '',
  closeHandler,
}: {
  classes?: string;
  closeHandler: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <NavigationMenu>
      <NavigationMenuList className={classes}>
        <NavigationMenuItem></NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
