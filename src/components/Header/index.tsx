// import Logo from "../../../assets/logo-blue.svg";
import logo_image from "@public/logo.png";
import { Container } from "./styles";
import Image from "next/image";
// import { useContextSelector } from "use-context-selector";

function Header({ children }: any) {
  return (
    <Container>
      <Image
        src={logo_image}
        alt="logo"
        style={{
          // width: "100%",
          width: 184,
          height: 82,
        }}
      />
      {children}
    </Container>
  );
}

export default Header;
