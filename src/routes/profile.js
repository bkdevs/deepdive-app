import { Card, Tabs, message as antdMessage } from "antd";
import DatabasesTab from "components/app/profile/databases_tab";
import ProfileTab from "components/app/profile/profile_tab";
import SessionsTab from "components/app/profile/sessions_tab";
import { createContext } from "react";
import { useNavigation } from "react-router-dom";

export const ProfileContext = createContext();

const Profile = () => {
  const [messageApi, contextHolder] = antdMessage.useMessage();
  const navigation = useNavigation();
  const loadingClass = navigation.state === "loading" ? "loading" : "";

  return (
    <ProfileContext.Provider value={{ messageApi: messageApi }}>
      {contextHolder}
      <div
        id="app-profile"
        className={
          "pt-36 flex justify-center content-center w-full " + loadingClass
        }
      >
        <Card className="w-3/5 min-w-[600px] h-[445px] deepdive-loading">
          <Tabs className="w-full h-[410px]" tabPosition="left" size="large">
            <Tabs.TabPane tab="Profile" key="profile">
              <div className="w-full h-[410px]">
                <ProfileTab />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Sessions" key="sessions">
              <div className="w-full">
                <SessionsTab />
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Databases" key="databases">
              <div className="w-full">
                <DatabasesTab />
              </div>
            </Tabs.TabPane>
          </Tabs>
        </Card>
      </div>
    </ProfileContext.Provider>
  );
};

export default Profile;
