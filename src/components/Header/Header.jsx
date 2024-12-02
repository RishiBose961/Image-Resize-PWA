import {Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/react";


export default function App() {
  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit text-2xl uppercase">Image Resize5</p>
      </NavbarBrand>
 
      <NavbarContent justify="end">
        <NavbarItem className="flex">
          <a href="https://github.com/RishiBose961">
          <img src="/icons8-github-150.png" loading="lazy" alt="loading" className="w-10 h-10 cursor-pointer"/>
          </a>
         
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}