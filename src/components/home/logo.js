import deepDiveLogo from "assets/deepdive-logo.svg";
import { Avatar } from "antd";

const Logo = () => {
  return (
    <a href="/" className="block" aria-label="DeepDive">
      <div className="flex justify-start mb-4 items-end gap-1">
        <Avatar shape="square" size="large" src={deepDiveLogo} />
        <h5 className="text-2xl font-extrabold leading-tighter tracking-tighter">
          DeepDive
        </h5>
      </div>
    </a>
  );
};

export const LogoDiv = () => {
  return (
    <div className="flex justify-start mb-4 items-end gap-1">
      <Avatar shape="square" size="large" src={deepDiveLogo} />
      <h5 className="text-2xl font-extrabold leading-tighter tracking-tighter">
        DeepDive
      </h5>
    </div>
  );
};

export default Logo;
