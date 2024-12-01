import { Navbar, NavbarBrand } from "@nextui-org/react";

export default function Header() {
  return (
    <Navbar>
      <NavbarBrand>
        <p className="font-bold text-inherit text-xl uppercase">Image Resize</p>
      </NavbarBrand>
    </Navbar>
  );
}
