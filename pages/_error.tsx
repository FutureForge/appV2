import { ErrorComponent } from "@/modules/app";
import { NextPageContext } from "next";
import NextError from "next/error";

function Error() {
  return <ErrorComponent />;
}

Error.getInitialProps = async (contextData: NextPageContext) => {
  return NextError.getInitialProps(contextData);
};

export default Error;
