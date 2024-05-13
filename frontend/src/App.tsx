import { FC, Suspense, lazy, useEffect, useState } from "react";
import { useLocalObservable } from "mobx-react-lite";
import { ToastContainer } from "react-toastify";
import { initializeEvents } from "./events";

import { Authentication } from "pages/auth/Authentication";
import EventManager from "utils/EventManager.util";

import ChatStore from "./stores/Chat.store";
import CreatorStore from "./stores/CharCreator.store";

const Chat = lazy(() => import("./pages/hud/Chat/Chat"));
const CharacterCreator = lazy(() => import("./pages/creator/CharCreator"));

import Notification from "utils/NotifyManager.util";
import "react-toastify/dist/ReactToastify.css";

const App: FC = () => {
    const chatStore = useLocalObservable(() => new ChatStore());
    const creatorStore = useLocalObservable(() => new CreatorStore());

    const [page, setPage] = useState<string>("creator");

    initializeEvents({ chatStore });

    useEffect(() => {
        EventManager.addHandler("system", "setPage", setPage);
        EventManager.addHandler("notify", "show", (data: { type: any; message: string; skin: any }) => Notification.show(data.type, data.message, data.skin));

        return () => {
            EventManager.stopAddingHandlers("notify");
            EventManager.stopAddingHandlers("system");
        };
    }, []);

    return (
        <div className="app">
            <Suspense>
                <ToastContainer
                    position="bottom-center"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable={false}
                    pauseOnHover
                    theme="dark"
                />
                <Chat store={chatStore} isVisible={page === "hud"} />
                {page === "auth" && <Authentication />}
                {page === "creator" && <CharacterCreator store={creatorStore} />}
            </Suspense>
        </div>
    );
};
export default App;