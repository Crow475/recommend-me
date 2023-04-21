import NavBar from "./navbar/navbar"

export default function Layout({ children }) {
    return (
      <>
        <NavBar />
        {children}
        {/* Footer */}
        {/* You can add more things here  */}
      </>
    );
  }