import React, {useState} from 'react';
import {GoogleLogin} from "@react-oauth/google";

import keyStorage from "../utils/storage";
import {LatLng} from "../utils/types";
import {usePStore} from "../store/store";
import {RouteDetailsModal} from "./Modal";

// Main App Component
function Modals() {
    const [showModal, setShowModal] = useState(false);
    // @ts-ignore
    const modal = usePStore(state => state.modal);
    console.log('aaa')
    console.log('aaa')
    console.log('aaa')
    console.log('aaa')
    console.log('aaa')
    console.log('aaa')
    function handleOpen() {
        // setForm((prevForm: any) => ({...prevForm, days: []}));
        setShowModal(true);
    }

    function handleClose() {
        setShowModal(false);
    }

    function openLocationPicker(key: "start" | "end") {
        if (key === "start") {
            // setIsChoosingStart(true);
        } else {
            // setIsChoosingEnd(true);
        }
    }

    function closeLocationPicker() {
        // setIsChoosingStart(false);
        // setIsChoosingEnd(false);
    }

    function chooseLocation(key: "start" | "end", latlng: LatLng) {
        // setForm((prevForm: any) => ({...prevForm, [key]: latlng}));
        closeLocationPicker();
    }

    // @ts-ignore
    const handleLoginSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;
        // localStorage.setItem("token", token);
        // Send token to backend
        const res = await fetch((import.meta.env.VITE_API_URL || 'https://api.route.cab') + "/auth/google", {
            method: "POST",
            credentials: "include", // Send/receive cookies
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({token}),
        }).then((res) => res.json());
        // setGu(res.user);
        keyStorage.sSetJ("user", res.user);
        localStorage.setItem("token", res.token);
        usePStore.getState().update('modal', null);
        usePStore.getState().update('tick', new Date());
        // alert("Logged in!");
    };
    console.log('modal')
    console.log('modal')
    console.log('modal')
    console.log(modal)

    if (!modal) {
        return null;
    }

    return (
        <RouteDetailsModal
            title={'Login'}
            onClose={closeLocationPicker}
            show
            hide
        >
            <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => alert("Login Failed")}
                useOneTap // Optional: enables auto popup for returning users
            />
        </RouteDetailsModal>
    );
}

export default Modals;
